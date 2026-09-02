import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QuotaStatus } from '../types/quota';

interface QuotaBadgeProps {
  quotaStatus: QuotaStatus;
  onPressSettings?: () => void;
}

export const QuotaBadge: React.FC<QuotaBadgeProps> = ({ quotaStatus, onPressSettings }) => {
  const isPersonalMode = quotaStatus.mode === 'BYOK_PERSONAL';

  return (
    <TouchableOpacity
      style={[
        styles.badge,
        isPersonalMode ? styles.personalBadge : styles.publicBadge,
      ]}
      onPress={onPressSettings}
      activeOpacity={0.8}
    >
      <Text style={[styles.badgeText, isPersonalMode ? styles.personalText : styles.publicText]}>
        {isPersonalMode ? '👑 個人專屬 API' : `⚡ 可刪: ${quotaStatus.maxDeletableCount} 支`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publicBadge: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3182CE',
  },
  personalBadge: {
    backgroundColor: '#FAF5FF',
    borderColor: '#805AD5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  publicText: {
    color: '#2B6CB0',
  },
  personalText: {
    color: '#6B46C1',
  },
});
