import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/stores/useAuthStore';
import { useSwipeDeckStore } from './src/stores/useSwipeDeckStore';
import { AuthScreen } from './src/screens/AuthScreen';
import { PlaylistScreen } from './src/screens/PlaylistScreen';
import { SwipeScreen } from './src/screens/SwipeScreen';
import { SummaryModal } from './src/components/SummaryModal';
import { QuotaSettingsModal } from './src/components/QuotaSettingsModal';
import { YouTubePlaylist, YouTubePlaylistItem } from './src/types/youtube';
import { StorageService } from './src/utils/StorageService';
import { QuotaEngine } from './src/utils/QuotaEngine';

type ActiveScreen = 'AUTH' | 'PLAYLISTS' | 'SWIPE';

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const apiMode = useAuthStore((state) => state.apiMode);
  const initDeck = useSwipeDeckStore((state) => state.initDeck);
  const clearDeckSession = useSwipeDeckStore((state) => state.clearDeckSession);

  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('AUTH');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Auto transition to playlists when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('PLAYLISTS');
      checkPendingCrashRecovery();
    } else {
      setCurrentScreen('AUTH');
    }
  }, [isAuthenticated]);

  // Check if uncommitted pending deletes exist from previous crash
  const checkPendingCrashRecovery = async () => {
    const pendingSession = await StorageService.getPendingSession();
    if (pendingSession && pendingSession.length > 0) {
      Alert.alert(
        '恢復上次整理',
        `偵測到上次有 ${pendingSession.length} 支未提交的刪除影片，是否繼續提交？`,
        [
          { text: '放棄紀錄', onPress: () => StorageService.clearPendingSession(), style: 'cancel' },
          {
            text: '立即提交',
            onPress: () => {
              useSwipeDeckStore.setState({ pendingDeleteQueue: pendingSession });
              setShowSummaryModal(true);
            },
          },
        ]
      );
    }
  };

  const handleSelectPlaylist = async (playlist: YouTubePlaylist) => {
    // Mock raw playlist items
    const mockRawItems: YouTubePlaylistItem[] = [
      {
        id: 'item_101',
        snippet: {
          playlistId: playlist.id,
          position: 0,
          title: '2026 前端全棧開發完整指南 (從零到精通實戰教學)',
          description: '完整的 Web 開發教學',
          publishedAt: '2026-01-15T10:00:00Z',
          thumbnails: {
            medium: { url: 'https://picsum.photos/seed/v1/320/180' },
          },
          channelTitle: '全棧開發者 Talk',
          resourceId: { kind: 'youtube#video', videoId: 'v101' },
        },
        contentDetails: { videoId: 'v101', duration: 'PT42M15S' },
      },
      {
        id: 'item_102',
        snippet: {
          playlistId: playlist.id,
          position: 1,
          title: 'Deleted video', // Unplayable video (Auto-pruner test)
          description: 'This video has been deleted',
          publishedAt: '2025-05-10T10:00:00Z',
          resourceId: { kind: 'youtube#video', videoId: 'v102' },
        },
      },
      {
        id: 'item_103',
        snippet: {
          playlistId: playlist.id,
          position: 2,
          title: 'TypeScript 高級型別與 Design Pattern 實戰',
          description: '泛型與 conditional types',
          publishedAt: '2026-03-20T10:00:00Z',
          thumbnails: {
            medium: { url: 'https://picsum.photos/seed/v3/320/180' },
          },
          channelTitle: 'TypeScript Master',
          resourceId: { kind: 'youtube#video', videoId: 'v103' },
        },
        contentDetails: { videoId: 'v103', duration: 'PT25M10S' },
      },
      {
        id: 'item_104',
        snippet: {
          playlistId: playlist.id,
          position: 3,
          title: 'React Native Reanimated 3 60fps 動畫實戰',
          description: '手勢與動畫極速優化',
          publishedAt: '2026-06-12T10:00:00Z',
          thumbnails: {
            medium: { url: 'https://picsum.photos/seed/v4/320/180' },
          },
          channelTitle: 'Mobile Dev Daily',
          resourceId: { kind: 'youtube#video', videoId: 'v104' },
        },
        contentDetails: { videoId: 'v104', duration: 'PT18M45S' },
      },
    ];

    const storedQuota = await StorageService.getQuotaData();
    const quotaStatus = QuotaEngine.calculateQuotaStatus(storedQuota || { dailyQuotaUsed: 500, lastResetDatePT: QuotaEngine.getTodayPTDateString() }, apiMode);

    initDeck(playlist, mockRawItems, quotaStatus.maxDeletableCount);
    setCurrentScreen('SWIPE');
  };

  const handleFinishDeck = () => {
    setShowSummaryModal(true);
  };

  const handleCommitSuccess = () => {
    setShowSummaryModal(false);
    clearDeckSession();
    setCurrentScreen('PLAYLISTS');
  };

  const handleContinueOther = () => {
    setShowSummaryModal(false);
    clearDeckSession();
    setCurrentScreen('PLAYLISTS');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Screen Switcher */}
      {currentScreen === 'AUTH' && (
        <AuthScreen onLoginSuccess={() => setCurrentScreen('PLAYLISTS')} />
      )}

      {currentScreen === 'PLAYLISTS' && (
        <PlaylistScreen
          onSelectPlaylist={handleSelectPlaylist}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {currentScreen === 'SWIPE' && (
        <SwipeScreen
          onFinishDeck={handleFinishDeck}
          onExit={() => setShowSummaryModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {/* Global Summary Modal */}
      <SummaryModal
        visible={showSummaryModal}
        onCommitSuccess={handleCommitSuccess}
        onContinueOther={handleContinueOther}
      />

      {/* Global Quota Settings Modal */}
      <QuotaSettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
