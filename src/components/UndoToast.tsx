import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { YouTubePlaylistItem } from '../types/youtube';

interface UndoToastProps {
  lastSwipedItem: YouTubePlaylistItem | null;
  onUndo: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({ lastSwipedItem, onUndo }) => {
  if (!lastSwipedItem) return null;

  return (
    <View style={styles.toast}>
      <Text style={styles.toastText} numberOfLines={1}>
        ❌ 已將「{lastSwipedItem.snippet?.title || '影片'}」加入刪除佇列
      </Text>
      <TouchableOpacity style={styles.undoBtn} onPress={onUndo} activeOpacity={0.8}>
        <Text style={styles.undoBtnText}>↩ Undo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    height: 44,
    backgroundColor: '#2D3748',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    fontSize: 11,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  undoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
  undoBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A202C',
  },
});
