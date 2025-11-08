import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

interface Profile {
  id: string;
  name: string;
  date: string;
  isPremium?: boolean;
}

interface ProfileContextType {
  user: any;
  profiles: Profile[];
  activeProfile: Profile | null;
  isPremium: boolean;
  isLoading: boolean;

  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  saveProfile: (profile: Omit<Profile, 'id'>) => Promise<void>;
  setActiveProfile: (id: string) => void;
  deleteProfile: (id: string) => Promise<void>;
  unlockPremium: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const LOCAL_PROFILES_KEY = '@profiles';
const ACTIVE_PROFILE_KEY = '@active_profile';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  // Авто-вход
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadProfilesFromFirestore(user.uid);
        await loadPremiumStatus(user.uid);
      } else {
        await loadLocalProfiles();
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  // Google Response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  // === FIRESTORE ===
  const loadProfilesFromFirestore = async (uid: string) => {
    const profilesRef = collection(db, 'users', uid, 'profiles');
    const q = query(profilesRef);
    const unsub = onSnapshot(q, async (snapshot) => {
      const loaded = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Profile));
      setProfiles(loaded);
      await AsyncStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(loaded));

      const activeId = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
      const active = loaded.find((p) => p.id === activeId) || loaded[0] || null;
      setActiveProfileState(active);
    });
    return unsub;
  };

  const loadPremiumStatus = async (uid: string) => {
    const premiumDoc = await getDoc(doc(db, 'users', uid, 'subscription', 'premium'));
    const premium = premiumDoc.exists() && premiumDoc.data()?.active;
    setIsPremium(premium);
  };

  const loadLocalProfiles = async () => {
    const local = await AsyncStorage.getItem(LOCAL_PROFILES_KEY);
    const activeId = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      setProfiles(parsed);
      setActiveProfileState(parsed.find((p: Profile) => p.id === activeId) || parsed[0] || null);
    }
  };

  const saveProfile = async (profileData: Omit<Profile, 'id'>) => {
    if (!user) {
      // Локально
      const id = Date.now().toString();
      const newProfile = { ...profileData, id };
      const updated = [...profiles, newProfile];
      setProfiles(updated);
      await AsyncStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
      if (!activeProfile) setActiveProfileState(newProfile);
      return;
    }

    const uid = user.uid;
    const id = Date.now().toString();
    await setDoc(doc(db, 'users', uid, 'profiles', id), { ...profileData, id });
  };

  const setActiveProfile = async (id: string) => {
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      setActiveProfileState(profile);
      await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, id);
    }
  };

  const deleteProfile = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'profiles', id));
    } else {
      const updated = profiles.filter((p) => p.id !== id);
      setProfiles(updated);
      await AsyncStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
      if (activeProfile?.id === id) {
        setActiveProfileState(updated[0] || null);
      }
    }
  };

  const unlockPremium = async () => {
    if (!user) {
      setIsPremium(true);
      return;
    }
    await setDoc(doc(db, 'users', user.uid, 'subscription', 'premium'), {
      active: true,
      unlockedAt: new Date(),
    });
    setIsPremium(true);
  };

  const loginWithGoogle = () => promptAsync();
  const loginWithEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);
  const logout = async () => {
    await firebaseSignOut(auth);
    await AsyncStorage.multiRemove([LOCAL_PROFILES_KEY, ACTIVE_PROFILE_KEY]);
    setProfiles([]);
    setActiveProfileState(null);
    setIsPremium(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        profiles,
        activeProfile,
        isPremium,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        saveProfile,
        setActiveProfile,
        deleteProfile,
        unlockPremium,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
};
