# Tab Workspace

> 個人辦公提效工作台 — Tab 管理、網站導覽、線上音樂、個人相簿

## 功能

- **Tab 管理** — 管理所有開啟的分頁，收藏常用頁面，批次關閉，逐個清除網站快取
- **網站導覽** — 按分類預設網站捷徑，支援新增/編輯/刪除，根據語言自動切換預設網站（國內 40+ / 國際 37+）
- **線上音樂** — 快捷存取 7 個音樂平台（網易雲、QQ、酷狗、酷我、Spotify、YouTube Music、Apple Music），精美 SVG 品牌圖示
- **個人相簿** — 個人照片畫廊，支援拖曳上傳，IndexedDB 本機儲存
- **設定** — 主題自訂、資料匯出/匯入、可設定快取清除選項、多語言支援

## 技術堆疊

- React 18 + TypeScript + Vite 5
- Zustand 狀態管理
- TailwindCSS + CSS 變數主題
- Manifest V3 瀏覽器擴充功能
- IndexedDB 照片儲存，chrome.storage 設定儲存

## 安裝

### 方式一：開發人員模式載入（推薦）

1. 下載對應瀏覽器的 ZIP 包並解壓縮
2. 開啟瀏覽器的擴充功能管理頁面
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. 啟用 **開發人員模式**
4. 點擊 **載入未封裝的擴充功能**，選擇解壓縮後的目錄

### 方式二：CRX 檔案安裝（Chrome）

1. 下載 `tab-workspace-chrome.crx` 檔案
2. 開啟 `chrome://extensions/`，啟用 **開發人員模式**
3. 將 `.crx` 檔案拖曳到擴充功能管理頁面
4. 確認安裝

> **注意**：新版 Chrome 可能阻止安裝未上架的 CRX 檔案。如遇阻止提示，請使用方式一。

## 開發

```bash
pnpm install       # 安裝依賴
pnpm dev           # 啟動開發伺服器
pnpm test          # 執行測試
pnpm build:chrome  # 建置 Chrome 版本
```

## 多語言支援

支援英語、簡體中文、繁體中文。預設語言根據瀏覽器語言自動偵測，可在設定頁面切換。

## License

[MIT](LICENSE)
