// contexts/ProfileContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
  } catch (e) {}
}

const LAST_KNOWN_AUTH = '@last_known_auth';
const GUEST_PROFILE_KEY = '@guest_profile';

export interface Profile {
  id: string;
  name: string;
  date: string;
  isPremium?: boolean;
}

interface ProfileContextType {
  user: User | null;
  profiles: Profile[];
  activeProfile: Profile | null;
  isPremium: boolean;
  isLoading: boolean;
  authInitialized: boolean;

  isDrawerVisible: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  sendPasswordResetEmail: (email: string) => Promise<void>;

  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (displayName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveProfile: (data: { name: string; date: string }) => Promise<void>;
  setActiveProfile: (profile: Profile) => void;
  completeOnboarding: () => Promise<void>;
  unlockPremium: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const router = useRouter();
  const prevUserRef = useRef<User | null>(null);

  useEffect(() => {
    let unsubProfiles: Unsubscribe | null = null;

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      const wasLoggedIn = prevUserRef.current !== null;
      const isNowLoggedIn = firebaseUser !== null;

      if (firebaseUser) {
        await AsyncStorage.setItem(LAST_KNOWN_AUTH, 'user_' + firebaseUser.uid);
        await AsyncStorage.removeItem(GUEST_PROFILE_KEY);
        setUser(firebaseUser);

        unsubProfiles?.();
        unsubProfiles = onSnapshot(
          collection(db, 'users', firebaseUser.uid, 'profiles'),
          (snap) => {
            const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as Profile));
            setProfiles(loaded);
            if (loaded.length > 0 && !activeProfile) {
              setActiveProfile(loaded[0]);
            }
          }
        );

        const premiumSnap = await getDoc(doc(db, 'users', firebaseUser.uid, 'subscription', 'premium'));
        setIsPremium(premiumSnap.exists() && premiumSnap.data()?.active === true);

        if (!wasLoggedIn && isNowLoggedIn) {
          router.replace('/(tabs)/pythagoras');
        }
      } else {
        const lastKnown = await AsyncStorage.getItem(LAST_KNOWN_AUTH);

        if (lastKnown?.startsWith('user_')) {
          // Firebase потерял сессию — но мы доверяем AsyncStorage
          const uid = lastKnown.slice(5);
          setUser({ uid } as User);

          unsubProfiles = onSnapshot(
            collection(db, 'users', uid, 'profiles'),
            (snap) => {
              const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as Profile));
              setProfiles(loaded);
              if (loaded.length > 0) setActiveProfile(loaded[0]);
            }
          );
        } else if (lastKnown === 'guest') {
          const json = await AsyncStorage.getItem(GUEST_PROFILE_KEY);
          if (json) {
            const guest = JSON.parse(json);
            setProfiles([guest]);
            setActiveProfile(guest);
          }
        } else {
          setProfiles([]);
          setActiveProfile(null);
        }

        setUser(null);
        setIsPremium(false);

        if (wasLoggedIn && !isNowLoggedIn) {
          router.replace('/(auth)/onboarding');
        }
      }

      prevUserRef.current = firebaseUser;
      setAuthInitialized(true);
      setIsLoading(false);
    });

    return () => {
      unsub();
      unsubProfiles?.();
    };
  }, []);

  const completeOnboarding = async () => {
    const guest: Profile = { id: 'guest_1', name: 'Гость', date: '' };
    await AsyncStorage.multiSet([
      [LAST_KNOWN_AUTH, 'guest'],
      [GUEST_PROFILE_KEY, JSON.stringify(guest)],
    ]);
    setProfiles([guest]);
    setActiveProfile(guest);
    router.replace('/(tabs)/pythagoras');
  };

  const saveProfile = async ({ name, date }: { name: string; date: string }) => {
    if (!user) {
      const profile = { id: 'guest_' + Date.now(), name, date };
      await AsyncStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
      setProfiles([profile]);
      setActiveProfile(profile);
    } else {
      const id = Date.now().toString();
      await setDoc(doc(db, 'users', user.uid, 'profiles', id), { id, name, date });
    }
  };

  const loginWithGoogle = async () => {
    if (!GoogleSignin) throw new Error('Google Sign-In недоступен');
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.idToken || userInfo.data?.idToken;
    if (!idToken) throw new Error('Нет токена');
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (displayName: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
  };

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.multiRemove([LAST_KNOWN_AUTH, GUEST_PROFILE_KEY]);
    router.replace('/(auth)/onboarding');
  };

  const unlockPremium = async () => {
    if (!user) return setIsPremium(true);
    await setDoc(doc(db, 'users', user.uid, 'subscription', 'premium'), {
      active: true,
      unlockedAt: new Date(),
    });
    setIsPremium(true);
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw error; // пробрасываем ошибку дальше — в компоненте обработаем
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        profiles,
        activeProfile,
        isPremium,
        isLoading,
        authInitialized,

        isDrawerVisible,
        openDrawer,
        closeDrawer,
        sendPasswordResetEmail,

        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        saveProfile,
        setActiveProfile,
        completeOnboarding,
        unlockPremium,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};
