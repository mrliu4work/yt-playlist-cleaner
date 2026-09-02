import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';
import { QuotaMode } from '../types/quota';

interface QuotaSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuotaSettingsModal: React.FC<QuotaSettingsModalProps> = ({ visible, onClose }) => {
  const currentMode = useAuthStore((state) => state.apiMode);
  const personalApiKey = useAuthStore((state) => state.personalApiKey);
  const setBYOKKey = useAuthStore((state) => state.setBYOKKey);
  const setApiMode = useAuthStore((state) => state.setApiMode);

  const [selectedMode, setSelectedMode] = useState<QuotaMode>(currentMode);
  const [inputKey, setInputKey] = useState<string>(personalApiKey || '');

  const handleSave = async () => {
    if (selectedMode === 'BYOK_PERSONAL') {
      if (!inputKey.trim()) {
        Alert.alert('提示', '請輸入有效的 Google YouTube API Key');
        return;
      }
      await setBYOKKey(inputKey.trim());
    } else {
      await setApiMode('PUBLIC_SHARED');
    }
    onClose();
  };

  const handleOpenTutorial = () => {
    Linking.openURL('https://console.cloud.google.com/apis/credentials');
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>⚙️ API 配額與 Token 設定</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Mode 1 Box */}
          <TouchableOpacity
            style={[
              styles.optionBox,
              selectedMode === 'PUBLIC_SHARED' && styles.selectedOptionBox,
            ]}
            onPress={() => setSelectedMode('PUBLIC_SHARED')}
            activeOpacity={0.85}
          >
            <View style={styles.radioRow}>
              <View style={[styles.radioOuter, selectedMode === 'PUBLIC_SHARED' && styles.radioOuterSelected]}>
                {selectedMode === 'PUBLIC_SHARED' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionTitle}>模式 1：App 免費公用額度 (共享)</Text>
            </View>
            <Text style={styles.optionDesc}>• 今日美西重置剩餘：18 支刪除容量</Text>
            <Text style={styles.optionDesc}>• 所有使用者共享 GCP 10,000 每日 Quota</Text>
          </TouchableOpacity>

          {/* Mode 2 Box (BYOK) */}
          <TouchableOpacity
            style={[
              styles.optionBox,
              selectedMode === 'BYOK_PERSONAL' && styles.selectedOptionBox,
            ]}
            onPress={() => setSelectedMode('BYOK_PERSONAL')}
            activeOpacity={0.85}
          >
            <View style={styles.radioRow}>
              <View style={[styles.radioOuter, selectedMode === 'BYOK_PERSONAL' && styles.radioOuterSelected]}>
                {selectedMode === 'BYOK_PERSONAL' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.optionTitle, { color: '#2B6CB0' }]}>
                模式 2：個人專屬 API Key (BYOK 推薦)
              </Text>
            </View>
            <Text style={styles.optionDesc}>• 享有獨佔 10,000 每日 Quota (約可刪 200 支/天)</Text>
            <Text style={styles.optionDesc}>• 輸入您申請的 Google YouTube API Key：</Text>

            <TextInput
              style={styles.keyInput}
              placeholder="AIzaSyD-xxxxxxxxxxxxxxxxxxxx"
              value={inputKey}
              onChangeText={setInputKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </TouchableOpacity>

          {/* Tutorial Link */}
          <TouchableOpacity style={styles.tutorialBtn} onPress={handleOpenTutorial}>
            <Text style={styles.tutorialBtnText}>
              📖 點此查看：30 秒免費申請個人 API Key 教學
            </Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>儲存並套用設定</Text>
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
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  closeBtn: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: 'bold',
  },
  optionBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    backgroundColor: '#F7FAFC',
    padding: 14,
    marginBottom: 12,
  },
  selectedOptionBox: {
    borderColor: '#3182CE',
    backgroundColor: '#EBF8FF',
    borderWidth: 1.5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A0AEC0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#3182CE',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3182CE',
  },
  optionTitle: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  optionDesc: {
    fontSize: 10.5,
    color: '#718096',
    marginTop: 2,
    marginLeft: 24,
  },
  keyInput: {
    marginTop: 10,
    marginLeft: 24,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    paddingHorizontal: 10,
    fontSize: 11,
    color: '#1A202C',
  },
  tutorialBtn: {
    marginVertical: 12,
    alignItems: 'center',
  },
  tutorialBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3182CE',
  },
  saveBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#3182CE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
