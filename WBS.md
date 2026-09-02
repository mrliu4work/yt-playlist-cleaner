# 📋 工作分解結構 (WBS - Work Breakdown Structure)
## 專案名稱：YouTube 零碎時間極速清理 App (yt-playlist-cleaner)

| 階段 / WBS 編號 | 工作項目 (Task Name) | 說明與交付物 | 預計 Git Branch 名稱 |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **專案初始化與基礎建設** | **Project Setup & Base Architecture** | |
| **WBS 1.1** | 專案初始化與結構設定 | 初始化 Expo (React Native) + TypeScript 環境，配置 ESLint / Prettier 與基本目錄。 | `feature/wbs-1.1-project-setup` |
| **WBS 1.2** | 數據模型與 TypeScript 類型定義 | 定義 `YouTubePlaylistItem`, `Playlist`, `QuotaData`, `Zustand State` 介面。 | `feature/wbs-1.2-types-definitions` |
| **Phase 2** | **核心引擎與數據流服務** | **Core Engines & Data Layer** | |
| **WBS 2.1** | 配額護欄與本地儲存引擎 | 實作 `QuotaEngine.ts`（美西時間 00:00 重置、`MaxDeletableCount` 計算）與 `StorageService.ts` (`SecureStore` + `AsyncStorage`)。 | `feature/wbs-2.1-quota-storage-engine` |
| **WBS 2.2** | YouTube Data API Client & 自動預處理 | 實作 `youtubeClient.ts`、OAuth Token 刷新與 `processPlaylistItems`（無效影片/直播自動過濾機制）。 | `feature/wbs-2.2-youtube-api-client` |
| **WBS 2.3** | Zustand 全局狀態管理 Store | 實作 `useAuthStore`（登入狀態/BYOK Key）與 `useSwipeDeckStore`（單一 Undo Slot、離線佇列、批次刪除 Worker）。 | `feature/wbs-2.3-zustand-stores` |
| **Phase 3** | **UI 元件與畫面開發** | **UI Components & Screen Development** | |
| **WBS 3.1** | Screen 1: Auth & Onboarding 登入頁 | 建立登入頁 UI、3 步驟轉存圖文指引與 Google OAuth 觸發按鈕。 | `feature/wbs-3.1-auth-screen` |
| **WBS 3.2** | Screen 2: Playlist Selector 播放清單選擇頁 | 建立清單列表 UI、使用者 Header、`⚡ 可刪數` 額度徽章與下拉重整手勢。 | `feature/wbs-3.2-playlist-screen` |
| **WBS 3.3** | Screen 3: Tinder Swipe Deck 刷卡主頁 | 建立卡片元件、16:9 縮圖、標準數字時長標籤、左滑/右滑手勢、單一 Undo Toast 浮條與配額截斷 Banner。 | `feature/wbs-3.3-swipe-screen` |
| **WBS 3.4** | Screen 4: Session Summary 清理結算頁 | 建立慶祝結算 Modal、數據統計表（刪除數/釋放時間/保留數）與批次 Commit 觸發流程。 | `feature/wbs-3.4-summary-screen` |
| **WBS 3.5** | Modal: API 配額與 BYOK 設定頁 | 建立 `QuotaSettingsModal`，支援模式 1（共享配額）與模式 2（BYOK 個人 Key）無縫切換。 | `feature/wbs-3.5-settings-modal` |
| **Phase 4** | **整合測試與發布準備** | **Integration, Edge Case Testing & Docs** | |
| **WBS 4.1** | 全流程整合與離線/崩潰復原測試 | 整合 Screen 1~4 全流程，驗證斷線暫存、閃退 Session 恢復與 404 刪除容錯。 | `feature/wbs-4.1-e2e-integration` |
| **WBS 4.2** | 最終文件與使用手冊整備 | 完善 README.md、開發者安裝部署指引與 API 配額說明文檔。 | `feature/wbs-4.2-final-docs` |

---

## 🔄 開發工作流規範 (Git Workflow Rules)

1. **Branch 命名**：所有開發皆從 `main` branch 切出 `feature/wbs-X.Y-<task-name>`。
2. **單一職責**：每個 WBS 僅處理其對應的交付物與功能。
3. **提交與合併**：
   - 在 feature branch 內完成程式碼與檔案變更。
   - 提交專屬 Commit。
   - 將 feature branch 變更合併 (Merge) 回 `main` branch。
