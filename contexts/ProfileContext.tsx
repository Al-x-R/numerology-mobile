import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile,
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
import { useRouter, useSegments } from 'expo-router';
import { Platform } from 'react-native';
import { t } from '@/lib/constants/locales';

let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
  } catch (e) {
    console.log('Google Sign-In not initialized (web or setup missing)');
  }
}

const LAST_KNOWN_AUTH = '@last_known_auth';
const GUEST_PROFILE_KEY = '@guest_profile';

export interface Profile {
  id: string;
  name: string;
  date: string;
  isPremium?: boolean;
  language?: 'en' | 'ru';
}

interface ProfileContextType {
  user: User | null;
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;
  authInitialized: boolean;

  sendPasswordResetEmail: (email: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  // Обновили сигнатуру: добавили birthDate
  registerWithEmail: (displayName: string, email: string, password: string, birthDate?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveProfile: (data: { name: string; date: string }) => Promise<void>;
  setActiveProfile: (profile: Profile) => void;
  completeOnboarding: () => Promise<void>;
  unlockPremium: () => Promise<void>;
  updateUserProfile: (data: {
    displayName?: string;
    birthDate?: string;
    photoURL?: string | null | undefined;
    language?: 'en' | 'ru';
  }) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const router = useRouter();
  const segments = useSegments();

  const prevUserRef = useRef<User | null>(null);


  useEffect(() => {
    let unsubProfiles: Unsubscribe | null = null;

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      const wasLoggedIn = prevUserRef.current !== null;
      const isNowLoggedIn = firebaseUser !== null;

      if (firebaseUser) {
        await AsyncStorage.setItem(LAST_KNOWN_AUTH, 'user_' + firebaseUser.uid);
        await AsyncStorage.removeItem(GUEST_PROFILE_KEY);

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const customData = userDocSnap.exists() ? userDocSnap.data() : {};

        setUser({
          ...firebaseUser,
          birthDate: customData.birthDate ?? null,
          isPremium: customData.isPremium ?? false,
          language: customData.language ?? null,
        } as User & { birthDate?: string | null; isPremium?: boolean });

        unsubProfiles?.();
        unsubProfiles = onSnapshot(
          collection(db, 'users', firebaseUser.uid, 'profiles'),
          (snap) => {
            const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as Profile));
            setProfiles(loaded);

            if (loaded.length > 0 && !activeProfile) {
              setActiveProfile(loaded[0]);
            }
          },
          (error) => {
            console.error("Error fetching profiles snapshot:", error);
          }
        );

        setAuthInitialized(true);
        setIsLoading(false);

      } else {
        await handleGuestOrLogout(wasLoggedIn, isNowLoggedIn);

        setAuthInitialized(true);
        setIsLoading(false);
      }

      prevUserRef.current = firebaseUser;
    });

    return () => {
      unsub();
      unsubProfiles?.();
    };
  }, []);

  const handleGuestOrLogout = async (wasLoggedIn: boolean, isNowLoggedIn: boolean) => {
    const lastKnown = await AsyncStorage.getItem(LAST_KNOWN_AUTH);

    if (lastKnown === 'guest') {
      const json = await AsyncStorage.getItem(GUEST_PROFILE_KEY);
      if (json) {
        try {
          const guest = JSON.parse(json);
          setProfiles([guest]);
          setActiveProfile(guest);
        } catch (e) {
          console.error("Error parsing guest profile:", e);
          setProfiles([]);
          setActiveProfile(null);
        }
      }
    } else {
      setProfiles([]);
      setActiveProfile(null);
    }

    setUser(null);

    if (wasLoggedIn && !isNowLoggedIn && authInitialized) {
      router.replace('/(auth)/onboarding');
    }
  }

  const completeOnboarding = async () => {
    const guest: Profile = { id: 'guest_1', name: t('profile.guest'), date: '' };
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
      try {
        await setDoc(doc(db, 'users', user.uid, 'profiles', id), { id, name, date });
      } catch (e) {
        console.error("Error saving profile to Firestore:", e);
        throw e;
      }
    }
  };

  const loginWithGoogle = async () => {
    console.log("Attempting Google Sign-In...");

    if (!GoogleSignin) {
      throw new Error('Google Sign-In недоступен на этом устройстве');
    }

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.idToken || userInfo.data?.idToken;
      if (!idToken) {
        throw new Error('Не удалось получить ID token от Google (токен отсутствует)');
      }

      const credential = GoogleAuthProvider.credential(idToken);

      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {

        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          isPremium: false,
          birthDate: null
        });
        console.log("User document created in Firestore via Google Login");
      }

    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (displayName: string, email: string, password: string, birthDate?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(cred.user, { displayName });

    const userDocRef = doc(db, 'users', cred.user.uid);
    await setDoc(userDocRef, {
      email: email,
      displayName: displayName,
      photoURL: cred.user.photoURL,
      createdAt: new Date(),
      isPremium: false,
      birthDate: birthDate || null
    });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([LAST_KNOWN_AUTH, GUEST_PROFILE_KEY]);
    await signOut(auth);
  };

  const unlockPremium = async () => {
    if (!user) {
      // setIsPremium(true);
      return;
    }
    try {
      await setDoc(doc(db, 'users', user.uid, 'subscription', 'premium'), {
        active: true,
        unlockedAt: new Date(),
      });
    } catch (e) {
      console.error("Error unlocking premium:", e);
      throw e;
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      throw error;
    }
  };


  const updateUserProfile = async (data: {
    displayName?: string;
    birthDate?: string | undefined;
    photoURL?: string | null;
    language?: 'en' | 'ru';
  }): Promise<void> => {
    if (!user) return;

    const updates: Record<string, any> = {};

    if (data.displayName !== undefined) {
      updates.displayName = data.displayName.trim();
    }
    if (data.birthDate !== undefined) {
      updates.birthDate = data.birthDate;
    }

    if (data.photoURL !== undefined) {
      updates.photoURL = data.photoURL;
    }

    if (Object.keys(updates).length === 0) return;

    try {
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });

      setUser(prev => prev ? { ...prev, ...updates } : null);

      if (data.displayName !== undefined || data.photoURL !== undefined) {
        const authUpdates: { displayName?: string; photoURL?: string | null } = {};

        if (data.displayName !== undefined) authUpdates.displayName = data.displayName;
        if (data.photoURL !== undefined) authUpdates.photoURL = data.photoURL;

        try {
          await updateProfile(auth.currentUser!, authUpdates);
          await auth.currentUser?.reload();
        } catch (err) {
          console.log('Auth profile update warning:', err);
        }
      }
    } catch (error) {
      console.error('updateUserProfile error:', error);
      throw error;
    }
  };


  return (
    <ProfileContext.Provider
      value={{
        user,
        profiles,
        activeProfile,
        isLoading,
        authInitialized,

        sendPasswordResetEmail,

        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        saveProfile,
        setActiveProfile,
        completeOnboarding,
        unlockPremium,
        updateUserProfile
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
