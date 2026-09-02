import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';

interface AuthScreenProps {
  onLoginSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  const handleGoogleLogin = async () => {
    // Mock OAuth Token Exchange for development/demo
    // In production, expo-auth-session is triggered
    const mockAccessToken = 'ya29.mock_access_token_yt_cleaner';
    const mockRefreshToken = '1//mock_refresh_token_yt_cleaner';

    await setTokens(mockAccessToken, mockRefreshToken);
    setUserProfile({
      name: 'Alex Developer',
      email: 'alex.developer@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    });

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Logo Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>▶</Text>
          </View>
          <Text style={styles.appTitle}>YT Playlist Cleaner</Text>
          <Text style={styles.appSubtitle}>利用零碎時間 ‧ 1 分鐘極速清理</text>
        </View>

        {/* 3-Step Onboarding Guide Card */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>💡 3 秒轉存「稍後觀看」指引：</Text>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: '#3182CE' }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>打開 YouTube App 點擊「稍後觀看」</Text>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: '#3182CE' }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>點擊右上角「...」➔「儲存至播放清單」</Text>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: '#3182CE' }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>建立或選擇自訂清單（如：待清理）</Text>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: '#38A169' }]}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={[styles.stepText, { fontWeight: 'bold', color: '#22543D' }]}>
              回到本 App 即可開啟極速刷卡！
            </Text>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleGoogleLogin} activeOpacity={0.85}>
          <Text style={styles.loginButtonText}>G   使用 Google 帳號登入 (OAuth)</Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>
          🔒 隱私安全：Token 僅存放於手機本地 SecureStore
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
  guideCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 28,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 12.5,
    color: '#4A5568',
    flex: 1,
  },
  loginButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  privacyNote: {
    fontSize: 11,
    color: '#A0AEC0',
    textAlign: 'center',
  },
});
