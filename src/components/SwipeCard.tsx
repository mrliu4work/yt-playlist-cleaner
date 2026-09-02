import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { YouTubePlaylistItem } from '../types/youtube';

interface SwipeCardProps {
  item: YouTubePlaylistItem;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ item }) => {
  const thumbnailUrl = item.snippet?.thumbnails?.medium?.url || 'https://via.placeholder.com/320x180';

  return (
    <View style={styles.card}>
      {/* Video 16:9 Thumbnail Box */}
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        
        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.badgeText}>⏱️ {item.formattedDuration || '00:00'}</Text>
        </View>

        {/* Added Date Badge */}
        <View style={styles.addedBadge}>
          <Text style={styles.badgeText}>📅 8 個月前加入</Text>
        </View>
      </View>

      {/* Video Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.title} numberOfLines={2}>
          {item.snippet?.title || 'Untitled Video'}
        </Text>
        <Text style={styles.channelText} numberOfLines={1}>
          頻道：{item.snippet?.channelTitle || 'YouTube Channel'}  <Text style={styles.checkIcon}>✔</Text>
        </Text>

        {/* Informational Tags */}
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>標準影片</Text>
          </View>
          <View style={styles.tagWarning}>
            <Text style={styles.tagWarningText}>久未觀看</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 410,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#2D3748',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  addedBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoSection: {
    padding: 16,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A202C',
    lineHeight: 22,
  },
  channelText: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 6,
  },
  checkIcon: {
    color: '#3182CE',
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#EDF2F7',
    marginRight: 8,
  },
  tagText: {
    fontSize: 10,
    color: '#4A5568',
  },
  tagWarning: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#FEEBC8',
  },
  tagWarningText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#744210',
  },
});
