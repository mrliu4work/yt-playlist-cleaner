# 📱 YouTube 零碎時間極速清理 App (YT Playlist Cleaner)

一款專為**零碎時間（1~3 分鐘）**打造的輕量化手機 App。透過 Tinder 式的直覺單手滑卡手勢（左滑刪除、右滑保留），將複雜的 YouTube 播放清單整理轉化為極低心智負擔的單一二元決策，高效率瘦身堆積影片！

---

## 🌟 核心特色 (Core Features)

1. **零碎時間 Tinder 滑卡引擎**：
   - **左滑 (Left Swipe)**：刪除影片，加入待刪佇列。
   - **右滑 (Right Swipe)**：保留影片，繼續觀看。
   - **Single-Slot Undo**：提供單一倒數復原浮條，連滑自動覆蓋保持極簡。
2. **無效影片自動預處理 (Auto-Pruner Engine)**：
   - 載入清單時自動辨識已下架、私人影片並自動移入刪除佇列，不浪費任何一次手勢！
   - 直播與未開播影片自動保留並跳過，100% 確保卡片時長皆為標準數字。
3. **API 配額防爆與容量護欄 (Quota Protection Engine)**：
   - 以美西時間太平洋時區 (PT) 00:00 為每日重置基準。
   - 自動計算當日剩餘容量並做 Deck 容量截斷（Clamping），**100% 杜絕「滑完卻因為配額不足而無法刪除」的崩潰體驗**！
4. **自備 API Key 模式 (BYOK - Bring Your Own Key)**：
   - 支援模式 1（App 免費公用額度）與模式 2（個人專屬 API Key）無縫切換，重度使用者可獨佔 10,000 每日 Quota。
5. **Local-First & 閃退/離線復原**：
   - 無伺服器架構，OAuth Token 加密存於本地 `expo-secure-store`。
   - 每次左滑即時將刪除佇列寫入 `AsyncStorage`，閃退重新開啟自動跳出恢復提示。

---

## 📖 專案文件 (Documentation)

- [📄 產品需求規格書 (PRD.md)](./PRD.md)
- [📋 工作分解結構 (WBS.md)](./WBS.md)
- [🖼️ UX Wireframe 圖檔目錄](./docs/wireframes/)

---

## 🛠️ 技術棧 (Tech Stack)

- **前端框架**：Expo (React Native) + TypeScript
- **狀態管理**：Zustand
- **數據存儲**：`expo-secure-store` (OAuth Tokens / BYOK Keys) + `AsyncStorage` (Quota & Pending Session)
- **API 介接**：YouTube Data API v3

---

## 🚀 快速開始與本地開發 (Quick Start)

### 1. 安裝依賴套件
```bash
cd yt-playlist-cleaner
npm install
```

### 2. 啟動 Expo 開發伺服器
```bash
npm start
```
- 按 `i` 在 iOS 模擬器開啟
- 按 `a` 在 Android 模擬器開啟
- 掃描 QR Code 使用 Expo Go App 在實體手機運行

---

## 📜 開發工作流規範 (Git Workflow)

本專案所有功能皆嚴格遵循 **WBS 導向的 Git Branching 工作流**：
1. 從 `main` branch 切出 `feature/wbs-X.Y-<task-name>`。
2. 完成該 WBS 項目的程式碼開發與測試。
3. 提交 PR 並 Squash Merge 回 `main` branch。
