import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuotaData, QuotaMode } from '../types/quota';
import { UserProfile } from '../types/store';
import { YouTubePlaylistItem } from '../types/youtube';

const KEYS = {
  ACCESS_TOKEN: 'yt_access_token',
  REFRESH_TOKEN: 'yt_refresh_token',
  PERSONAL_API_KEY: 'yt_personal_api_key',
  USER_PROFILE: 'yt_user_profile',
  QUOTA_MODE: 'yt_quota_mode',
  QUOTA_DATA: 'yt_quota_data',
  PENDING_DELETES: 'yt_pending_deletes_session',
  STATS_FREED_SECONDS: 'yt_stats_freed_seconds',
  STATS_DELETED_COUNT: 'yt_stats_deleted_count',
};

export class StorageService {
  // --- SecureStore Operations (Tokens & Secret Keys) ---
  static async saveTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  static async getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    const accessToken = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    return { accessToken, refreshToken };
  }

  static async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  }

  static async savePersonalApiKey(key: string | null): Promise<void> {
    if (key) {
      await SecureStore.setItemAsync(KEYS.PERSONAL_API_KEY, key);
    } else {
      await SecureStore.deleteItemAsync(KEYS.PERSONAL_API_KEY);
    }
  }

  static async getPersonalApiKey(): Promise<string | null> {
    return await SecureStore.getItemAsync(KEYS.PERSONAL_API_KEY);
  }

  // --- AsyncStorage Operations (Public Session & Quota Data) ---
  static async saveQuotaMode(mode: QuotaMode): Promise<void> {
    await AsyncStorage.setItem(KEYS.QUOTA_MODE, mode);
  }

  static async getQuotaMode(): Promise<QuotaMode> {
    const mode = await AsyncStorage.getItem(KEYS.QUOTA_MODE);
    return (mode as QuotaMode) || 'PUBLIC_SHARED';
  }

  static async saveQuotaData(data: QuotaData): Promise<void> {
    await AsyncStorage.setItem(KEYS.QUOTA_DATA, JSON.stringify(data));
  }

  static async getQuotaData(): Promise<QuotaData | null> {
    const raw = await AsyncStorage.getItem(KEYS.QUOTA_DATA);
    return raw ? JSON.parse(raw) : null;
  }

  static async savePendingSession(pendingDeletes: YouTubePlaylistItem[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.PENDING_DELETES, JSON.stringify(pendingDeletes));
  }

  static async getPendingSession(): Promise<YouTubePlaylistItem[]> {
    const raw = await AsyncStorage.getItem(KEYS.PENDING_DELETES);
    return raw ? JSON.parse(raw) : [];
  }

  static async clearPendingSession(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.PENDING_DELETES);
  }

  static async saveUserProfile(profile: UserProfile | null): Promise<void> {
    if (profile) {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } else {
      await AsyncStorage.removeItem(KEYS.USER_PROFILE);
    }
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  }
}
