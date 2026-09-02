import { YouTubePlaylist, YouTubePlaylistItem } from './youtube';
import { QuotaMode, QuotaStatus } from './quota';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: UserProfile | null;
  apiMode: QuotaMode;
  personalApiKey: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  setUserProfile: (profile: UserProfile) => void;
  setBYOKKey: (apiKey: string | null) => Promise<void>;
  setApiMode: (mode: QuotaMode) => Promise<void>;
  logout: () => Promise<void>;
}

export interface BatchCommitResult {
  successCount: number;
  failedCount: number;
  freedSeconds: number;
}

export interface SwipeDeckState {
  activePlaylist: YouTubePlaylist | null;
  activeDeck: YouTubePlaylistItem[];
  autoDeletedQueue: YouTubePlaylistItem[];
  pendingDeleteQueue: YouTubePlaylistItem[];
  keptQueue: YouTubePlaylistItem[];
  lastSwipedItem: YouTubePlaylistItem | null;
  lastSwipeAction: 'DELETE' | 'KEEP' | null;
  isProcessingBatch: boolean;

  // Actions
  initDeck: (playlist: YouTubePlaylist, rawItems: YouTubePlaylistItem[], maxDeletable: number) => void;
  swipeLeft: () => void; // Delete
  swipeRight: () => void; // Keep
  undoLastSwipe: () => void;
  commitDeletions: () => Promise<BatchCommitResult>;
  clearDeckSession: () => void;
}
