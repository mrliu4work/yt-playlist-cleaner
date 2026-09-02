import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';
import { QuotaBadge } from '../components/QuotaBadge';
import { QuotaEngine } from '../utils/QuotaEngine';
import { StorageService } from '../utils/StorageService';
import { YouTubePlaylist } from '../types/youtube';
import { QuotaStatus } from '../types/quota';

interface PlaylistScreenProps {
  onSelectPlaylist: (playlist: YouTubePlaylist) => void;
  onOpenSettings: () => void;
}

export const PlaylistScreen: React.FC<PlaylistScreenProps> = ({
  onSelectPlaylist,
  onOpenSettings,
}) => {
  const userProfile = useAuthStore((state) => state.userProfile);
  const apiMode = useAuthStore((state) => state.apiMode);
  const logout = useAuthStore((state) => state.logout);

  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus>({
    mode: apiMode,
    availableUnits: 9500,
    maxDeletableCount: 180,
    isExhausted: false,
    lastResetDatePT: QuotaEngine.getTodayPTDateString(),
  });
  const [refreshing, setRefreshing] = useState(false);

  // Load playlists & quota
  const loadData = async () => {
    setRefreshing(true);
    const storedQuota = await StorageService.getQuotaData();
    const status = QuotaEngine.calculateQuotaStatus(storedQuota || { dailyQuotaUsed: 500, lastResetDatePT: QuotaEngine.getTodayPTDateString() }, apiMode);
    setQuotaStatus(status);

    // Mock playlists for development/demo
    const mockData: YouTubePlaylist[] = [
      {
        id: 'pl_001',
        snippet: {
          title: '待清理精選 (To Clean)',
          description: '堆積的無效長影片',
          publishedAt: '2026-08-30T10:00:00Z',
          thumbnails: {
            medium: { url: 'https://picsum.photos/seed/yt1/300/200' },
          },
          channelTitle: 'Alex Developer',
        },
        contentDetails: { itemCount: 48 },
      },
      {
        id: 'pl_002',
        snippet: {
          title: '深度學習與 AI 教學',
          description: '機器學習經典課程',
          publishedAt: '2026-08-01T10:00:00Z',
          thumbnails: {
            medium: { url: 'https://picsum.photos/seed/yt2/300/200' },
          },
          channelTitle: 'Alex Developer',
        },
        contentDetails: { itemCount: 120 },
      },
      {
        id: 'pl_003',
        snippet: {
          title: '工作背景音樂暫存',
          description: 'Lo-Fi / Focus Music',
          publishedAt: '2026-08-28T10:00:00Z',
          thumbnails: {
            medium: { url: 'https://picsum.photos/seed/yt3/300/200' },
          },
          channelTitle: 'Alex Developer',
        },
        contentDetails: { itemCount: 15 },
      },
    ];

    setPlaylists(mockData);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [apiMode]);

  const renderPlaylistItem = ({ item }: { item: YouTubePlaylist }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelectPlaylist(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/150' }}
        style={styles.cardThumbnail}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.snippet.title}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.contentDetails.itemCount} 支影片 • 上次更新 2 天前
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>自訂播放清單</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <Image
            source={{ uri: userProfile?.avatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <View style={styles.userTextCol}>
            <Text style={styles.userName} numberOfLines={1}>
              {userProfile?.name || 'User'}
            </Text>
            <Text style={styles.userStatus}>已連線至 YouTube API</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <QuotaBadge quotaStatus={quotaStatus} onPressSettings={onOpenSettings} />
          <TouchableOpacity style={styles.settingsBtn} onPress={onOpenSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instruction Banner */}
      <View style={styles.instructionBanner}>
        <Text style={styles.instructionText}>
          💡 點擊下方播放清單，即可開始極速刷卡清理
        </Text>
      </View>

      {/* Playlists List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>你的自訂播放清單 ({playlists.length})</Text>
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={renderPlaylistItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadData} colors={['#3182CE']} />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Footer Guide Note */}
      <TouchableOpacity style={styles.footerGuide} onPress={onOpenSettings}>
        <Text style={styles.footerGuideText}>📖 沒看到想要的清單？[點此查看轉存教學]</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#CBD5E0',
  },
  userTextCol: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  userStatus: {
    fontSize: 10,
    color: '#718096',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#EDF2F7',
  },
  settingsIcon: {
    fontSize: 14,
  },
  logoutBtn: {
    marginLeft: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#EDF2F7',
  },
  logoutIcon: {
    fontSize: 14,
  },
  instructionBanner: {
    margin: 16,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FEFCBF',
    borderWidth: 1,
    borderColor: '#D69E2E',
  },
  instructionText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#744210',
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginVertical: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardThumbnail: {
    width: 100,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#CBD5E0',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#E6FFFA',
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#234E52',
  },
  footerGuide: {
    paddingVertical: 14,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
  },
  footerGuideText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#3182CE',
  },
});
