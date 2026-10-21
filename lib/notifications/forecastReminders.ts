// lib/notifications/forecastReminders.ts
// Local daily reminders about new forecasts. There is no push backend: forecasts are static files,
// and the personal day number and zodiac sign are known on the device, so every notification
// is scheduled ahead of time with its own text.
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Locale, t } from '@/lib/constants/locales';
import { calculatePersonalDay } from '@/lib/calculators/numerologyForecast';
import { getZodiacName, getZodiacSign } from '@/lib/calculators/zodiac';
import { parseLocalDate } from '@/lib/utils/date';

const SETTINGS_KEY = '@forecast_reminders';
const CHANNEL_ID = 'daily-forecasts';
// Rescheduled on every app launch, so users who stop opening the app stop getting reminders after this window
const DAYS_AHEAD = 30;

export const REMINDERS_URL = '/(tabs)/today';

export interface ReminderSettings {
  dayNumber: boolean;
  horoscope: boolean;
  hour: number;
  minute: number;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  dayNumber: false,
  horoscope: false,
  hour: 9,
  minute: 0,
};

interface SyncParams {
  settings: ReminderSettings;
  birthDate: string | null;
  isPremium: boolean;
  language: Locale;
}

// Without a handler notifications are not shown while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const pad = (n: number) => String(n).padStart(2, '0');

export const formatReminderTime = ({ hour, minute }: Pick<ReminderSettings, 'hour' | 'minute'>) =>
  `${pad(hour)}:${pad(minute)}`;

export const hasActiveReminders = (settings: ReminderSettings) => settings.dayNumber || settings.horoscope;

export const loadReminderSettings = async (): Promise<ReminderSettings> => {
  const json = await AsyncStorage.getItem(SETTINGS_KEY);
  return json ? { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(json) } : DEFAULT_REMINDER_SETTINGS;
};

export const saveReminderSettings = (settings: ReminderSettings) =>
  AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

export const getNotificationPermission = async (): Promise<boolean> =>
  (await Notifications.getPermissionsAsync()).granted;

export const requestNotificationPermission = async (language: Locale): Promise<boolean> => {
  // Android 13+ shows the permission prompt only after a channel exists
  await ensureChannel(language);
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
};

const ensureChannel = async (language: Locale) => {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: t('notifications.channelName', language),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

const buildContent = (
  settings: ReminderSettings,
  dayNumber: number,
  signName: string,
  language: Locale,
): { title: string; body: string } => {
  const fill = (key: string) =>
    t(key, language).replace('{number}', String(dayNumber)).replace('{sign}', signName);

  // Both forecasts come in a single notification to avoid two pings at the same time
  if (settings.dayNumber && settings.horoscope) {
    return { title: fill('notifications.combinedTitle'), body: fill('notifications.combinedBody') };
  }
  if (settings.dayNumber) {
    return { title: fill('notifications.dayNumberTitle'), body: fill('notifications.dayNumberBody') };
  }
  return { title: fill('notifications.horoscopeTitle'), body: fill('notifications.horoscopeBody') };
};

const syncNow = async ({ settings, birthDate, isPremium, language }: SyncParams) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!isPremium || !birthDate || !hasActiveReminders(settings)) return;
  if (!(await getNotificationPermission())) return;

  await ensureChannel(language);

  const signName = getZodiacName(getZodiacSign(parseLocalDate(birthDate)), language);
  const now = new Date();

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, settings.hour, settings.minute);
    if (date <= now) continue;

    const dayNumber = calculatePersonalDay(birthDate, date);

    await Notifications.scheduleNotificationAsync({
      content: { ...buildContent(settings, dayNumber, signName, language), data: { url: REMINDERS_URL } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
    });
  }
};

let syncQueue: Promise<void> = Promise.resolve();

// Syncs run one after another so that cancel and schedule calls of overlapping syncs never interleave
export const syncForecastReminders = (params: SyncParams): Promise<void> => {
  syncQueue = syncQueue
    .then(() => syncNow(params))
    .catch(e => console.error('Forecast reminders sync error:', e));
  return syncQueue;
};
