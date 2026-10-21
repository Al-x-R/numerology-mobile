// contexts/NotificationsContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DEFAULT_REMINDER_SETTINGS,
  getNotificationPermission,
  hasActiveReminders,
  loadReminderSettings,
  ReminderSettings,
  requestNotificationPermission,
  saveReminderSettings,
  syncForecastReminders,
} from '@/lib/notifications/forecastReminders';

interface NotificationsContextType {
  settings: ReminderSettings;
  // null until checked
  permissionGranted: boolean | null;
  // False until saved settings are read; until then `settings` holds defaults and must not be saved over
  isLoaded: boolean;
  // Returns false if the user turned something on but did not allow notifications
  updateSettings: (patch: Partial<ReminderSettings>) => Promise<boolean>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeProfile, isPremium, isOnboarded, isLoading: isProfileLoading } = useProfile();
  const { language } = useLanguage();

  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  // Bumped when the app returns to the foreground to roll the scheduled window forward
  const [foregroundTick, setForegroundTick] = useState(0);

  const birthDate = activeProfile?.date || null;

  useEffect(() => {
    loadReminderSettings()
      .then(setSettings)
      .catch(e => console.error('Error loading reminder settings:', e))
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') setForegroundTick(tick => tick + 1);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isLoaded || isProfileLoading) return;

    // Permission can be revoked in system settings while the app is in the background
    getNotificationPermission().then(setPermissionGranted);
    syncForecastReminders({ settings, birthDate, isPremium, language });
  }, [settings, birthDate, isPremium, language, isLoaded, isProfileLoading, foregroundTick]);

  // Tapping a reminder opens the screen stored in its data
  const lastResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (!lastResponse || !isOnboarded) return;
    if (lastResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;

    const url = lastResponse.notification.request.content.data?.url;
    if (typeof url === 'string') router.navigate(url as Parameters<typeof router.navigate>[0]);
  }, [lastResponse, isOnboarded]);

  const updateSettings = useCallback(async (patch: Partial<ReminderSettings>) => {
    const next = { ...settings, ...patch };
    const turningOn = hasActiveReminders(next) && (patch.dayNumber || patch.horoscope);

    if (turningOn) {
      const granted = await requestNotificationPermission(language);
      setPermissionGranted(granted);
      if (!granted) return false;
    }

    setSettings(next);
    await saveReminderSettings(next);
    return true;
  }, [settings, language]);

  return (
    <NotificationsContext.Provider value={{ settings, permissionGranted, isLoaded, updateSettings }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
  return context;
};
