import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSwipeDeckStore } from '../stores/useSwipeDeckStore';
import { SwipeCard } from '../components/SwipeCard';
import { UndoToast } from '../components/UndoToast';

interface SwipeScreenProps {
  onFinishDeck: () => void;
  onExit: () => void;
  onOpenSettings: () => void;
}

export const SwipeScreen: React.FC<SwipeScreenProps> = ({
  onFinishDeck,
  onExit,
  onOpenSettings,
}) => {
  const activePlaylist = useSwipeDeckStore((state) => state.activePlaylist);
  const activeDeck = useSwipeDeckStore((state) => state.activeDeck);
  const lastSwipedItem = useSwipeDeckStore((state) => state.lastSwipedItem);
  const swipeLeft = useSwipeDeckStore((state) => state.swipeLeft);
  const swipeRight = useSwipeDeckStore((state) => state.swipeRight);
  const undoLastSwipe = useSwipeDeckStore((state) => state.undoLastSwipe);

  const topCard = activeDeck[0];

  // Auto trigger summary modal when deck is empty
  useEffect(() => {
    if (activeDeck.length === 0 && activePlaylist) {
      onFinishDeck();
    }
  }, [activeDeck.length, activePlaylist]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onExit}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.playlistHeaderTitle} numberOfLines={1}>
          📋 {activePlaylist?.snippet.title || '播放清單'} (剩餘 {activeDeck.length})
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Truncation Banner */}
      <TouchableOpacity style={styles.banner} onPress={onOpenSettings} activeOpacity={0.85}>
        <Text style={styles.bannerTextMain}>
          ⚠️ 公用額度尚可刪 18 支，已預載前 18 張卡片
        </Text>
        <Text style={styles.bannerTextSub}>
          [ 點此切換個人 API Key 解鎖完整清單 ]
        </Text>
      </TouchableOpacity>

      {/* Main Deck Container */}
      <View style={styles.deckContainer}>
        {topCard ? (
          <View style={styles.cardWrapper}>
            {/* Background Deck Card Shadow */}
            {activeDeck.length > 1 && <View style={styles.cardBgShadow} />}
            <SwipeCard item={topCard} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🎉 本輪刷卡已完成！</Text>
          </View>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={swipeLeft}
          activeOpacity={0.8}
        >
          <Text style={styles.btnIcon}>❌</Text>
          <Text style={[styles.btnLabel, styles.deleteLabel]}>刪除</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.keepBtn]}
          onPress={swipeRight}
          activeOpacity={0.8}
        >
          <Text style={styles.btnIcon}>❤️</Text>
          <Text style={[styles.btnLabel, styles.keepLabel]}>保留</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Single Undo Toast */}
      <UndoToast lastSwipedItem={lastSwipedItem} onUndo={undoLastSwipe} />
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
    backgroundColor: '#2D3748',
  },
  closeBtn: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  playlistHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  banner: {
    backgroundColor: '#FFF5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#FEB2B2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bannerTextMain: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#C53030',
  },
  bannerTextSub: {
    fontSize: 9.5,
    color: '#2B6CB0',
    marginTop: 2,
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  cardBgShadow: {
    position: 'absolute',
    top: 10,
    width: '92%',
    height: 400,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E0',
    borderWidth: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 70,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteBtn: {
    backgroundColor: '#FEB2B2',
    borderColor: '#E53E3E',
  },
  keepBtn: {
    backgroundColor: '#C6F6D5',
    borderColor: '#38A169',
  },
  btnIcon: {
    fontSize: 16,
  },
  btnLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  deleteLabel: {
    color: '#9B2C2C',
  },
  keepLabel: {
    color: '#22543D',
  },
});
