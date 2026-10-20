// contexts/ProfileContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const ONBOARDED_KEY = '@onboarded';
const PROFILES_KEY = '@profiles';
const ACTIVE_PROFILE_KEY = '@active_profile_id';
// Temporary local flag until RevenueCat is integrated
const PREMIUM_KEY = '@premium_status';

// Profile photos were removed from the app; the folder is deleted on launch to free up space
const LEGACY_AVATARS_DIR = `${FileSystem.documentDirectory}avatars/`;

export interface Profile {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD or ''
}

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  isPremium: boolean;

  completeOnboarding: () => Promise<void>;
  updateProfile: (data: { name?: string; date?: string }) => Promise<void>;
  setActiveProfile: (profile: Profile) => void;
  setPremiumStatus: (status: boolean) => Promise<void>;
  resetAppData: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const createDefaultProfile = (): Profile => ({
  id: Date.now().toString(),
  name: '', // an empty name is shown as "Guest" in the current language
  date: '',
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [[, onboarded], [, profilesJson], [, activeId], [, premium]] = await AsyncStorage.multiGet([
          ONBOARDED_KEY,
          PROFILES_KEY,
          ACTIVE_PROFILE_KEY,
          PREMIUM_KEY,
        ]);

        // Drops fields of older app versions, such as `photo`
        const loaded: Profile[] = (profilesJson ? JSON.parse(profilesJson) : []).map(
          ({ id, name, date }: Profile) => ({ id, name, date }),
        );
        setProfiles(loaded);
        setActiveProfileState(loaded.find(p => p.id === activeId) ?? loaded[0] ?? null);
        setIsOnboarded(onboarded === 'true');
        setIsPremium(premium === 'true');
      } catch (e) {
        console.error('Error loading local profile data:', e);
      } finally {
        setIsLoading(false);
      }

      FileSystem.deleteAsync(LEGACY_AVATARS_DIR, { idempotent: true }).catch(() => {});
    })();
  }, []);

  const persistProfiles = async (next: Profile[], active: Profile | null) => {
    setProfiles(next);
    setActiveProfileState(active);
    await AsyncStorage.multiSet([
      [PROFILES_KEY, JSON.stringify(next)],
      [ACTIVE_PROFILE_KEY, active?.id ?? ''],
    ]);
  };

  const completeOnboarding = async () => {
    if (profiles.length === 0) {
      const profile = createDefaultProfile();
      await persistProfiles([profile], profile);
    }
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
    setIsOnboarded(true);
  };

  const updateProfile = async (data: { name?: string; date?: string }) => {
    const current = activeProfile ?? createDefaultProfile();
    const updated: Profile = { ...current };

    if (data.name !== undefined) updated.name = data.name.trim();
    if (data.date !== undefined) updated.date = data.date;

    const exists = profiles.some(p => p.id === updated.id);
    const next = exists ? profiles.map(p => (p.id === updated.id ? updated : p)) : [...profiles, updated];
    await persistProfiles(next, updated);
  };

  const setActiveProfile = (profile: Profile) => {
    setActiveProfileState(profile);
    AsyncStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
  };

  const setPremiumStatus = async (status: boolean) => {
    setIsPremium(status);
    await AsyncStorage.setItem(PREMIUM_KEY, String(status));
  };

  const resetAppData = async () => {
    // PRO status is kept: it belongs to the purchase, not the profile
    await AsyncStorage.multiRemove([ONBOARDED_KEY, PROFILES_KEY, ACTIVE_PROFILE_KEY]);
    setProfiles([]);
    setActiveProfileState(null);
    setIsOnboarded(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        isLoading,
        isOnboarded,
        isPremium,

        completeOnboarding,
        updateProfile,
        setActiveProfile,
        setPremiumStatus,
        resetAppData,
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
