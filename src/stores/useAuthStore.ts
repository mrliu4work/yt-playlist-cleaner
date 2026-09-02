import { create } from 'zustand';
import { AuthState, UserProfile } from '../types/store';
import { QuotaMode } from '../types/quota';
import { StorageService } from '../utils/StorageService';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  userProfile: null,
  apiMode: 'PUBLIC_SHARED',
  personalApiKey: null,
  isAuthenticated: false,

  setTokens: async (accessToken: string, refreshToken?: string) => {
    await StorageService.saveTokens(accessToken, refreshToken);
    set({
      accessToken,
      refreshToken: refreshToken || get().refreshToken,
      isAuthenticated: true,
    });
  },

  setUserProfile: (userProfile: UserProfile) => {
    StorageService.saveUserProfile(userProfile);
    set({ userProfile });
  },

  setBYOKKey: async (personalApiKey: string | null) => {
    await StorageService.savePersonalApiKey(personalApiKey);
    const newMode: QuotaMode = personalApiKey ? 'BYOK_PERSONAL' : 'PUBLIC_SHARED';
    await StorageService.saveQuotaMode(newMode);
    set({ personalApiKey, apiMode: newMode });
  },

  setApiMode: async (apiMode: QuotaMode) => {
    await StorageService.saveQuotaMode(apiMode);
    set({ apiMode });
  },

  logout: async () => {
    await StorageService.clearTokens();
    await StorageService.saveUserProfile(null);
    set({
      accessToken: null,
      refreshToken: null,
      userProfile: null,
      isAuthenticated: false,
    });
  },
}));
