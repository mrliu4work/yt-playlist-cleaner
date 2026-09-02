import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useSwipeDeckStore } from '../stores/useSwipeDeckStore';
import { formatSecondsToHumanReadable } from '../utils/duration';

interface SummaryModalProps {
  visible: boolean;
  onCommitSuccess: () => void;
  onContinueOther: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  visible,
  onCommitSuccess,
  onContinueOther,
}) => {
  const pendingDeleteQueue = useSwipeDeckStore((state) => state.pendingDeleteQueue);
  const autoDeletedQueue = useSwipeDeckStore((state) => state.autoDeletedQueue);
  const keptQueue = useSwipeDeckStore((state) => state.keptQueue);
  const commitDeletions = useSwipeDeckStore((state) => state.commitDeletions);
  const isProcessingBatch = useSwipeDeckStore((state) => state.isProcessingBatch);

  const totalToDelete = autoDeletedQueue.length + pendingDeleteQueue.length;

  let totalFreedSeconds = 0;
  for (const item of [...autoDeletedQueue, ...pendingDeleteQueue]) {
    totalFreedSeconds += item.parsedDurationSeconds || 0;
  }

  const handleCommit = async () => {
    await commitDeletions();
    onCommitSuccess();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header Icon */}
          <Text style={styles.emojiIcon}>🎉</Text>
          <Text style={styles.modalTitle}>太棒了！本輪清理完成</Text>
          <Text style={styles.modalSubtitle}>順利釋放你的播放清單空間</Text>

          {/* Stats Box */}
          <View style={styles.statsBox}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🗑️ 已刪除影片：</Text>
              <Text style={[styles.statValue, { color: '#E53E3E' }]}>{totalToDelete} 支</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>⏱️ 釋放播放時間：</Text>
              <Text style={[styles.statValue, { color: '#3182CE' }]}>
                {formatSecondsToHumanReadable(totalFreedSeconds)}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>💖 保留精選項目：</Text>
              <Text style={[styles.statValue, { color: '#38A169' }]}>{keptQueue.length} 支</Text>
            </View>
          </View>

          {/* Primary Commit Button */}
          <TouchableOpacity
            style={styles.commitBtn}
            onPress={handleCommit}
            disabled={isProcessingBatch}
            activeOpacity={0.85}
          >
            {isProcessingBatch ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.commitBtnText}>確定提交並套用刪除 (Commit)</Text>
            )}
          </TouchableOpacity>

          {/* Secondary Continue Button */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={onContinueOther}
            disabled={isProcessingBatch}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>繼續清理其他播放清單</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  emojiIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsBox: {
    width: '100%',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    padding: 16,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 12.5,
    color: '#4A5568',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commitBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#3182CE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  commitBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  continueBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A5568',
  },
});
