import { create } from 'zustand';
import { BatchCommitResult, SwipeDeckState } from '../types/store';
import { YouTubePlaylist, YouTubePlaylistItem } from '../types/youtube';
import { YouTubeClient } from '../api/youtubeClient';
import { StorageService } from '../utils/StorageService';
import { QuotaEngine, DELETE_COST_PER_ITEM } from '../utils/QuotaEngine';
import { useAuthStore } from './useAuthStore';

export const useSwipeDeckStore = create<SwipeDeckState>((set, get) => ({
  activePlaylist: null,
  activeDeck: [],
  autoDeletedQueue: [],
  pendingDeleteQueue: [],
  keptQueue: [],
  lastSwipedItem: null,
  lastSwipeAction: null,
  isProcessingBatch: false,

  initDeck: (playlist: YouTubePlaylist, rawItems: YouTubePlaylistItem[], maxDeletable: number) => {
    // 1. Run Auto-Pruner
    const { activeDeck: processedDeck, autoDeletedQueue, autoKeptQueue } =
      YouTubeClient.processPlaylistItems(rawItems);

    // 2. Clamp deck to maxDeletable count
    const clampedDeck = processedDeck.slice(0, maxDeletable);

    set({
      activePlaylist: playlist,
      activeDeck: clampedDeck,
      autoDeletedQueue,
      pendingDeleteQueue: [],
      keptQueue: autoKeptQueue,
      lastSwipedItem: null,
      lastSwipeAction: null,
    });
  },

  swipeLeft: () => {
    const { activeDeck, pendingDeleteQueue } = get();
    if (activeDeck.length === 0) return;

    const [currentCard, ...remainingDeck] = activeDeck;
    const newPendingDeletes = [currentCard, ...pendingDeleteQueue];

    // Persist pending session for crash recovery
    StorageService.savePendingSession(newPendingDeletes);

    set({
      activeDeck: remainingDeck,
      pendingDeleteQueue: newPendingDeletes,
      lastSwipedItem: currentCard, // Single-Slot Undo
      lastSwipeAction: 'DELETE',
    });
  },

  swipeRight: () => {
    const { activeDeck, keptQueue } = get();
    if (activeDeck.length === 0) return;

    const [currentCard, ...remainingDeck] = activeDeck;

    set({
      activeDeck: remainingDeck,
      keptQueue: [currentCard, ...keptQueue],
      lastSwipedItem: null, // Next swipe cancels previous Undo
      lastSwipeAction: 'KEEP',
    });
  },

  undoLastSwipe: () => {
    const { lastSwipedItem, lastSwipeAction, activeDeck, pendingDeleteQueue, keptQueue } = get();
    if (!lastSwipedItem || !lastSwipeAction) return;

    if (lastSwipeAction === 'DELETE') {
      const updatedPending = pendingDeleteQueue.filter((item) => item.id !== lastSwipedItem.id);
      StorageService.savePendingSession(updatedPending);

      set({
        activeDeck: [lastSwipedItem, ...activeDeck],
        pendingDeleteQueue: updatedPending,
        lastSwipedItem: null,
        lastSwipeAction: null,
      });
    } else if (lastSwipeAction === 'KEEP') {
      const updatedKept = keptQueue.filter((item) => item.id !== lastSwipedItem.id);
      set({
        activeDeck: [lastSwipedItem, ...activeDeck],
        keptQueue: updatedKept,
        lastSwipedItem: null,
        lastSwipeAction: null,
      });
    }
  },

  commitDeletions: async (): Promise<BatchCommitResult> => {
    set({ isProcessingBatch: true });
    const { autoDeletedQueue, pendingDeleteQueue } = get();
    const accessToken = useAuthStore.getState().accessToken || '';

    // Merge auto-deleted unplayable items + user swiped left items
    const allToDelete = [...autoDeletedQueue, ...pendingDeleteQueue];

    let totalFreedSeconds = 0;
    for (const item of allToDelete) {
      totalFreedSeconds += item.parsedDurationSeconds || 0;
    }

    // Execute batch delete
    const { successCount, failedCount } = await YouTubeClient.batchDeletePlaylistItems(
      allToDelete,
      accessToken
    );

    // Track Quota Used
    const cost = successCount * DELETE_COST_PER_ITEM;
    const storedQuota = await StorageService.getQuotaData();
    const updatedQuota = QuotaEngine.addQuotaCost(storedQuota, cost);
    await StorageService.saveQuotaData(updatedQuota);

    // Clear session
    await StorageService.clearPendingSession();

    set({
      isProcessingBatch: false,
      activeDeck: [],
      pendingDeleteQueue: [],
      autoDeletedQueue: [],
      lastSwipedItem: null,
    });

    return {
      successCount,
      failedCount,
      freedSeconds: totalFreedSeconds,
    };
  },

  clearDeckSession: () => {
    StorageService.clearPendingSession();
    set({
      activePlaylist: null,
      activeDeck: [],
      pendingDeleteQueue: [],
      autoDeletedQueue: [],
      keptQueue: [],
      lastSwipedItem: null,
      lastSwipeAction: null,
    });
  },
}));
