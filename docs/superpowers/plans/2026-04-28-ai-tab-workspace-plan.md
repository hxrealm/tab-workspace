# AI Tab Workspace 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个跨浏览器（Chrome/Edge/Safari）的新标签页插件，提供 Tab 管理、站点导航、在线音乐、个人相册等模块。

**Architecture:** 基于 Manifest V3 + React SPA 架构。新标签页被替换为 React 应用，左侧固定图标侧栏导航到各模块，主内容区动态渲染模块内容。数据存储使用 chrome.storage + IndexedDB。

**Tech Stack:** React 18 + TypeScript + Vite 5 + TailwindCSS + Zustand + webextension-polyfill + pnpm

---

## 文件总览

### 新增文件

| 文件 | 职责 |
|------|------|
| `package.json` | 项目依赖和脚本 |
| `vite.config.ts` | Vite 构建配置，支持多浏览器构建 |
| `tsconfig.json` | TypeScript 配置 |
| `tsconfig.node.json` | Node 侧 TS 配置 |
| `tailwind.config.js` | TailwindCSS 配置 + 自定义主题色 |
| `postcss.config.js` | PostCSS 配置 |
| `manifest.json` | Manifest V3 声明 |
| `public/newtab.html` | 新标签页 HTML 入口 |
| `src/main.tsx` | React 入口 |
| `src/App.tsx` | 根组件 + 路由 + 布局 |
| `src/types/index.ts` | 全局类型定义 |
| `src/styles/globals.css` | 全局样式 + Tailwind 指令 |
| `src/styles/theme.css` | 暖色纸质感主题 CSS 变量 |
| `src/store/uiStore.ts` | UI 全局状态（当前模块、面板展开等） |
| `src/store/settingsStore.ts` | 用户设置状态 |
| `src/hooks/useBrowserType.ts` | 检测浏览器类型 |
| `src/hooks/useStorage.ts` | 统一存储 hook（含降级） |
| `src/components/Sidebar.tsx` | 左侧图标侧栏 |
| `src/components/SubPanel.tsx` | 二级面板（模块子导航） |
| `src/components/SearchBar.tsx` | 顶部搜索栏（全局可复用） |
| `src/components/Toast.tsx` | 全局提示组件 |
| `src/utils/storage.ts` | 存储封装（sync/local/IDB 回退） |
| `src/utils/browser.ts` | 浏览器兼容性检测 |
| `src/utils/favicon.ts` | 获取网站 favicon URL |
| `src/modules/tab-manager/TabManager.tsx` | Tab 管理主页面 |
| `src/modules/tab-manager/TabCard.tsx` | 单个标签卡片组件 |
| `src/modules/tab-manager/WorkspacePanel.tsx` | 工作区管理面板 |
| `src/modules/tab-manager/TabActions.tsx` | 批量操作栏 |
| `src/modules/tab-manager/useTabs.ts` | Chrome Tabs API hook |
| `src/modules/tab-manager/tabStore.ts` | Tab 模块 Zustand store |
| `src/modules/site-nav/SiteNav.tsx` | 站点导航主页面 |
| `src/modules/site-nav/SiteCard.tsx` | 站点卡片组件 |
| `src/modules/site-nav/SiteGroup.tsx` | 站点分组容器 |
| `src/modules/site-nav/AddSiteModal.tsx` | 添加站点弹窗 |
| `src/modules/site-nav/siteStore.ts` | 站点模块 Zustand store |
| `src/modules/music-player/MusicPlayer.tsx` | 音乐播放器主页面 |
| `src/modules/music-player/MusicEmbed.tsx` | iframe 内嵌播放器 |
| `src/modules/music-player/MusicQuickLinks.tsx` | 音乐平台快捷入口 |
| `src/modules/photo-album/PhotoAlbum.tsx` | 相册主页面 |
| `src/modules/photo-album/PhotoGrid.tsx` | 图片网格组件 |
| `src/modules/photo-album/PhotoPreview.tsx` | 图片预览模态框 |
| `src/modules/photo-album/PhotoUpload.tsx` | 图片上传组件 |
| `src/modules/photo-album/photoStore.ts` | 相册模块 Zustand store + IndexedDB |
| `src/modules/settings/Settings.tsx` | 设置主页面 |
| `src/modules/settings/AppearancePanel.tsx` | 外观设置面板 |
| `src/modules/settings/DataPanel.tsx` | 数据管理面板 |

### 测试文件

| 文件 | 职责 |
|------|------|
| `vitest.config.ts` | Vitest 配置 |
| `src/__tests__/setup.ts` | 测试环境设置（mock chrome API） |
| `src/utils/__tests__/storage.test.ts` | 存储工具测试 |
| `src/utils/__tests__/favicon.test.ts` | favicon 工具测试 |
| `src/store/__tests__/uiStore.test.ts` | UI store 测试 |
| `src/modules/tab-manager/__tests__/tabStore.test.ts` | Tab store 测试 |
| `src/modules/tab-manager/__tests__/useTabs.test.ts` | Tab hook 测试 |
| `src/modules/site-nav/__tests__/siteStore.test.ts` | 站点 store 测试 |

---

## Phase 1: 项目初始化 + Tab 管理（核心功能）

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `manifest.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "ai-tab-workspace",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:chrome": "vite build --mode chrome",
    "build:edge": "vite build --mode edge",
    "build:safari": "vite build --mode safari",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.4",
    "lucide-react": "^0.436.0",
    "@ant-design/icons": "^5.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/chrome": "^0.0.270",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2",
    "typescript": "^5.5.4",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.41",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.0.5",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.8",
    "jsdom": "^24.1.1",
    "webextension-polyfill": "^0.12.0",
    "@crxjs/vite-plugin": "^0.1.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const browser = mode || 'chrome'
  const isSafari = browser === 'safari'

  return {
    plugins: [react()],
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir: resolve(__dirname, `build/${browser}`),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          newtab: resolve(__dirname, 'public/newtab.html'),
        },
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.BROWSER': JSON.stringify(browser),
    },
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'warm-bg': '#fefcf6',
        'warm-bg-dark': '#f7f3eb',
        'accent': 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'warm-text': '#5c4a3d',
        'warm-text-muted': '#a09080',
        'warm-border': '#e8ddd0',
        'warm-panel': '#f5efe6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: 创建 manifest.json**

```json
{
  "manifest_version": 3,
  "name": "AI Tab Workspace",
  "description": "个人办公提效工作台 - Tab管理、站点导航、音乐、相册",
  "version": "1.0.0",
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "permissions": [
    "tabs",
    "storage",
    "favicon"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png"
    }
  }
}
```

- [ ] **Step 8: 创建 vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

- [ ] **Step 9: 安装依赖**

```bash
pnpm install
```

- [ ] **Step 10: 创建基础目录结构**

```bash
mkdir -p public/icons src/{styles,components,modules/{tab-manager,site-nav,music-player,photo-album,settings},hooks,store,utils,types,__tests__}
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: initialize project scaffolding with Vite + React + TypeScript"
```

---

### Task 2: 类型定义 + 工具函数 + 测试环境

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/browser.ts`
- Create: `src/utils/favicon.ts`
- Create: `src/utils/storage.ts`
- Create: `src/__tests__/setup.ts`
- Create: `src/utils/__tests__/storage.test.ts`
- Create: `src/utils/__tests__/favicon.test.ts`

- [ ] **Step 1: 创建全局类型定义**

```typescript
// src/types/index.ts
import type { Tabs } from 'chrome'

export interface Workspace {
  id: string
  name: string
  tabIds: number[]
  createdAt: number
}

export interface TabInfo {
  id: number
  title: string
  url: string
  favIconUrl?: string
  pinned: boolean
  active: boolean
  windowId: number
}

export interface Site {
  id: string
  title: string
  url: string
  groupId: string
  order: number
  createdAt: number
}

export interface SiteGroup {
  id: string
  name: string
  order: number
}

export interface PhotoAlbum {
  id: string
  name: string
  order: number
}

export interface Photo {
  id: string
  albumId: string
  name: string
  thumbnail: string
  dataUrl?: string
  createdAt: number
}

export type ModuleId = 'tabs' | 'sites' | 'music' | 'photos' | 'settings'

export interface AppSettings {
  theme: {
    primaryColor: string
    backgroundUrl: string
    fontSize: 'small' | 'medium' | 'large'
  }
  searchEngine: 'google' | 'bing' | 'baidu'
  musicPlatform: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: {
    primaryColor: '#e8a87c',
    backgroundUrl: '',
    fontSize: 'medium',
  },
  searchEngine: 'google',
  musicPlatform: 'netease',
}

export interface ClosedTab {
  tab: TabInfo
  closedAt: number
}
```

- [ ] **Step 2: 创建浏览器兼容性检测工具**

```typescript
// src/utils/browser.ts
export type BrowserType = 'chrome' | 'edge' | 'safari' | 'firefox' | 'unknown'

export function detectBrowser(): BrowserType {
  const ua = navigator.userAgent
  if (ua.includes('Edg/')) return 'edge'
  if (ua.includes('Chrome/')) return 'chrome'
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'safari'
  if (ua.includes('Firefox/')) return 'firefox'
  return 'unknown'
}

export function isExtensionApiAvailable(): boolean {
  return typeof chrome !== 'undefined' && chrome.tabs !== undefined
}

export function getBrowserUnsupportedMessage(browser: BrowserType): string | null {
  if (browser === 'safari') {
    return 'Safari 模式下部分功能可能需要手动启用，请查看设置页面了解更多。'
  }
  return null
}
```

- [ ] **Step 3: 创建 favicon 获取工具**

```typescript
// src/utils/favicon.ts
const GOOGLE_FAVICON_API = 'https://www.google.com/s2/favicons'

export function getFaviconUrl(url: string, size: number = 32): string {
  try {
    const parsed = new URL(url)
    return `${GOOGLE_FAVICON_API}?domain=${parsed.hostname}&sz=${size}`
  } catch {
    return `${GOOGLE_FAVICON_API}?domain=example.com&sz=${size}`
  }
}

export function getDefaultFaviconUrl(size: number = 32): string {
  return `${GOOGLE_FAVICON_API}?domain=placeholder&sz=${size}`
}
```

- [ ] **Step 4: 创建存储封装（含降级）**

```typescript
// src/utils/storage.ts
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'

export async function getSettings(): Promise<AppSettings> {
  try {
    if (chrome?.storage?.sync) {
      const result = await chrome.storage.sync.get('settings')
      return result.settings ?? DEFAULT_SETTINGS
    }
  } catch {
    // 降级到 localStorage
  }
  return loadFromLocalStorage()
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    if (chrome?.storage?.sync) {
      await chrome.storage.sync.set({ settings })
      return
    }
  } catch {
    // 降级到 localStorage
  }
  saveToLocalStorage(settings)
}

function loadFromLocalStorage(): AppSettings {
  try {
    const data = localStorage.getItem('ai-tab-settings')
    return data ? JSON.parse(data) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveToLocalStorage(settings: AppSettings): void {
  try {
    localStorage.setItem('ai-tab-settings', JSON.stringify(settings))
  } catch {
    console.warn('Failed to save settings to localStorage')
  }
}

export async function getFromStorage<T>(key: string, defaultValue: T): Promise<T> {
  try {
    if (chrome?.storage?.sync) {
      const result = await chrome.storage.sync.get(key)
      return result[key] ?? defaultValue
    }
  } catch {
    // 降级
  }
  return getFromLocalStorage(key, defaultValue)
}

export async function saveToStorage(key: string, value: unknown): Promise<void> {
  try {
    if (chrome?.storage?.sync) {
      await chrome.storage.sync.set({ [key]: value })
      return
    }
  } catch {
    // 降级
  }
  localStorage.setItem(key, JSON.stringify(value))
}

export async function removeFromStorage(key: string): Promise<void> {
  try {
    if (chrome?.storage?.sync) {
      await chrome.storage.sync.remove(key)
      return
    }
  } catch {
    // 降级
  }
  localStorage.removeItem(key)
}

function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch {
    return defaultValue
  }
}
```

- [ ] **Step 5: 创建测试环境设置**

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom'

// Mock chrome extension API
global.chrome = {
  tabs: {
    query: vi.fn().mockResolvedValue([]),
    remove: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue({}),
    get: vi.fn().mockResolvedValue({}),
    create: vi.fn().mockResolvedValue({}),
  },
  storage: {
    sync: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    },
    local: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    },
  },
  favicon: {
    get: vi.fn().mockResolvedValue({}),
  },
} as unknown as typeof chrome
```

- [ ] **Step 6: 创建 favicon 测试**

```typescript
// src/utils/__tests__/favicon.test.ts
import { getFaviconUrl, getDefaultFaviconUrl } from '@/utils/favicon'

describe('getFaviconUrl', () => {
  it('returns google favicon URL for valid URL', () => {
    const result = getFaviconUrl('https://github.com/some/repo')
    expect(result).toContain('google.com/s2/favicons')
    expect(result).toContain('domain=github.com')
  })

  it('uses default size of 32 when not specified', () => {
    const result = getFaviconUrl('https://example.com')
    expect(result).toContain('sz=32')
  })

  it('uses custom size when specified', () => {
    const result = getFaviconUrl('https://example.com', 64)
    expect(result).toContain('sz=64')
  })

  it('handles invalid URLs gracefully', () => {
    const result = getFaviconUrl('not-a-valid-url')
    expect(result).toContain('domain=example.com')
  })
})

describe('getDefaultFaviconUrl', () => {
  it('returns placeholder favicon URL', () => {
    const result = getDefaultFaviconUrl()
    expect(result).toContain('domain=placeholder')
  })
})
```

- [ ] **Step 7: 创建 storage 测试**

```typescript
// src/utils/__tests__/storage.test.ts
import { saveSettings, getSettings, DEFAULT_SETTINGS } from '@/types'
import { saveToStorage, getFromStorage } from '@/utils/storage'

describe('storage utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('saveToStorage / getFromStorage', () => {
    it('saves and retrieves data from chrome.storage.sync', async () => {
      vi.mocked(chrome.storage.sync.get).mockResolvedValueOnce({
        testKey: 'testValue',
      })

      const result = await getFromStorage('testKey', 'default')
      expect(result).toBe('testValue')
    })

    it('returns default value when key not found', async () => {
      vi.mocked(chrome.storage.sync.get).mockResolvedValueOnce({})

      const result = await getFromStorage('missing', 'fallback')
      expect(result).toBe('fallback')
    })

    it('saves data to chrome.storage.sync', async () => {
      await saveToStorage('myKey', { foo: 'bar' })
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        myKey: { foo: 'bar' },
      })
    })
  })

  describe('localStorage fallback', () => {
    it('falls back to localStorage when chrome API fails', async () => {
      vi.mocked(chrome.storage.sync.get).mockRejectedValueOnce(new Error('API unavailable'))
      localStorage.setItem('testKey', '"localValue"')

      const result = await getFromStorage('testKey', 'default')
      expect(result).toBe('localValue')
    })
  })
})
```

- [ ] **Step 8: 运行测试确认通过**

```bash
pnpm test
```

Expected: All tests pass

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add types, utils (browser, favicon, storage) with tests"
```

---

### Task 3: 主题 + 全局 Store + 布局组件

**Files:**
- Create: `src/styles/globals.css`
- Create: `src/styles/theme.css`
- Create: `src/store/uiStore.ts`
- Create: `src/store/settingsStore.ts`
- Create: `src/store/__tests__/uiStore.test.ts`
- Create: `src/hooks/useBrowserType.ts`
- Create: `src/hooks/useStorage.ts`
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/SubPanel.tsx`
- Create: `src/components/Toast.tsx`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `public/newtab.html`

- [ ] **Step 1: 创建全局 CSS + 主题变量**

```css
/* src/styles/theme.css */
:root {
  --color-accent: #e8a87c;
  --color-accent-hover: #d27d5f;
  --color-bg: #fefcf6;
  --color-bg-dark: #f7f3eb;
  --color-sidebar: linear-gradient(180deg, #faf6ef, #f3eddf);
  --color-sidebar-bg: #faf6ef;
  --color-text: #5c4a3d;
  --color-text-muted: #a09080;
  --color-border: #e8ddd0;
  --color-panel: #f5efe6;
  --color-card-bg: #ffffff;
  --color-active-bg: rgba(232, 168, 124, 0.12);
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --shadow-sm: 0 1px 3px rgba(92, 74, 61, 0.06);
  --shadow-md: 0 2px 8px rgba(92, 74, 61, 0.08);
  --sidebar-width: 60px;
  --subpanel-width: 200px;
}
```

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
@import './theme.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--color-text);
  background: linear-gradient(180deg, var(--color-bg), var(--color-bg-dark));
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
```

- [ ] **Step 2: 创建 UI 全局 Store**

```typescript
// src/store/uiStore.ts
import { create } from 'zustand'
import type { ModuleId } from '@/types'

interface UiState {
  currentModule: ModuleId
  subPanelOpen: boolean
  sidebarCollapsed: boolean
  setModule: (module: ModuleId) => void
  toggleSubPanel: () => void
  setSubPanel: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  currentModule: 'tabs',
  subPanelOpen: true,
  sidebarCollapsed: false,
  setModule: (module) => set({ currentModule: module, subPanelOpen: true }),
  toggleSubPanel: () => set((state) => ({ subPanelOpen: !state.subPanelOpen })),
  setSubPanel: (open) => set({ subPanelOpen: open }),
}))
```

- [ ] **Step 3: 创建设置 Store**

```typescript
// src/store/settingsStore.ts
import { create } from 'zustand'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'
import { getSettings, saveSettings } from '@/utils/storage'

interface SettingsState extends AppSettings {
  loaded: boolean
  loadSettings: () => Promise<void>
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => Promise<void>
  setFullSettings: (settings: AppSettings) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_SETTINGS,
  loaded: false,
  loadSettings: async () => {
    const settings = await getSettings()
    set({ ...settings, loaded: true })
  },
  updateSetting: async (key, value) => {
    set((state) => {
      const updated = { ...state, [key]: value }
      saveSettings({
        theme: updated.theme,
        searchEngine: updated.searchEngine,
        musicPlatform: updated.musicPlatform,
      })
      return updated
    })
  },
  setFullSettings: async (settings) => {
    await saveSettings(settings)
    set({ ...settings, loaded: true })
  },
}))
```

- [ ] **Step 4: 创建 UI Store 测试**

```typescript
// src/store/__tests__/uiStore.test.ts
import { useUiStore } from '@/store/uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      currentModule: 'tabs',
      subPanelOpen: true,
      sidebarCollapsed: false,
    })
  })

  it('starts with tabs module', () => {
    expect(useUiStore.getState().currentModule).toBe('tabs')
  })

  it('changes current module', () => {
    useUiStore.getState().setModule('sites')
    expect(useUiStore.getState().currentModule).toBe('sites')
  })

  it('toggles subPanel', () => {
    useUiStore.getState().toggleSubPanel()
    expect(useUiStore.getState().subPanelOpen).toBe(false)
  })

  it('sets subPanel to specific value', () => {
    useUiStore.getState().setSubPanel(true)
    expect(useUiStore.getState().subPanelOpen).toBe(true)
  })
})
```

- [ ] **Step 5: 创建 hooks**

```typescript
// src/hooks/useBrowserType.ts
import { useMemo } from 'react'
import { detectBrowser, isExtensionApiAvailable } from '@/utils/browser'

export function useBrowserType() {
  return useMemo(() => {
    const browser = detectBrowser()
    const apiAvailable = isExtensionApiAvailable()
    return { browser, apiAvailable }
  }, [])
}
```

```typescript
// src/hooks/useStorage.ts
import { useCallback } from 'react'
import { getFromStorage, saveToStorage, removeFromStorage } from '@/utils/storage'

export function useStorage<T>(key: string, defaultValue: T) {
  const getValue = useCallback(async () => {
    return getFromStorage(key, defaultValue)
  }, [key, defaultValue])

  const setValue = useCallback(async (value: T) => {
    await saveToStorage(key, value)
  }, [key])

  const removeValue = useCallback(async () => {
    await removeFromStorage(key)
  }, [key])

  return { getValue, setValue, removeValue }
}
```

- [ ] **Step 6: 创建 Sidebar 组件**

```typescript
// src/components/Sidebar.tsx
import { useCallback } from 'react'
import { useUiStore } from '@/store/uiStore'
import type { ModuleId } from '@/types'
import {
  LayoutGrid,
  Globe,
  Music,
  Image,
  Settings,
} from 'lucide-react'

const MODULES: { id: ModuleId; icon: typeof LayoutGrid; label: string }[] = [
  { id: 'tabs', icon: LayoutGrid, label: 'Tab 管理' },
  { id: 'sites', icon: Globe, label: '站点导航' },
  { id: 'music', icon: Music, label: '在线音乐' },
  { id: 'photos', icon: Image, label: '个人相册' },
]

export function Sidebar() {
  const { currentModule, setModule } = useUiStore()

  const handleNav = useCallback(
    (id: ModuleId) => {
      setModule(id)
    },
    [setModule]
  )

  return (
    <div
      className="h-full flex flex-col items-center py-4 gap-2"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--color-sidebar)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div
        className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-sm"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
        }}
      >
        AI
      </div>

      {/* Module Icons */}
      {MODULES.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => handleNav(id)}
          title={label}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background:
              currentModule === id
                ? 'var(--color-active-bg)'
                : 'transparent',
            border:
              currentModule === id
                ? '2px solid var(--color-accent)'
                : '2px solid transparent',
            color:
              currentModule === id
                ? 'var(--color-accent)'
                : 'var(--color-text-muted)',
          }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </button>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings at bottom */}
      <button
        onClick={() => handleNav('settings')}
        title="设置"
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
        style={{
          background:
            currentModule === 'settings'
              ? 'var(--color-active-bg)'
              : 'transparent',
          border:
            currentModule === 'settings'
              ? '2px solid var(--color-accent)'
              : '2px solid transparent',
          color:
            currentModule === 'settings'
              ? 'var(--color-accent)'
              : 'var(--color-text-muted)',
        }}
      >
        <Settings size={18} strokeWidth={1.8} />
      </button>
    </div>
  )
}
```

- [ ] **Step 7: 创建 SubPanel 组件**

```typescript
// src/components/SubPanel.tsx
import { useUiStore } from '@/store/uiStore'
import type { ReactNode } from 'react'

interface SubPanelProps {
  children: ReactNode
}

export function SubPanel({ children }: SubPanelProps) {
  const { subPanelOpen } = useUiStore()

  if (!subPanelOpen) return null

  return (
    <div
      className="h-full overflow-y-auto p-3"
      style={{
        width: 'var(--subpanel-width)',
        background: 'var(--color-card-bg)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 8: 创建 Toast 组件**

```typescript
// src/components/Toast.tsx
import { useEffect } from 'react'
import { create } from 'zustand'

interface ToastData {
  message: string
  type: 'info' | 'success' | 'error'
  id: number
}

interface ToastState {
  toasts: ToastData[]
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void
  removeToast: (id: number) => void
}

let toastId = 0
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type = 'info') => {
    const id = ++toastId
    set((state) => ({ toasts: [...state.toasts, { message, type, id }] }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 3000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-4 py-2 rounded-lg text-sm text-white shadow-md cursor-pointer animate-fade-in"
          style={{
            background:
              toast.type === 'error'
                ? '#e74c3c'
                : toast.type === 'success'
                ? '#27ae60'
                : 'var(--color-text)',
          }}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 9: 创建 main.tsx 入口**

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 10: 创建 App.tsx 根组件**

```typescript
// src/App.tsx
import { Sidebar } from '@/components/Sidebar'
import { SubPanel } from '@/components/SubPanel'
import { Toast } from '@/components/Toast'
import { TabManager } from '@/modules/tab-manager/TabManager'
import { useUiStore } from '@/store/uiStore'

export function App() {
  const { currentModule } = useUiStore()

  return (
    <div className="h-full flex">
      {/* Left sidebar */}
      <Sidebar />

      {/* Sub panel */}
      <SubPanel>
        {currentModule === 'tabs' && <TabSubPanel />}
      </SubPanel>

      {/* Main content */}
      <main className="flex-1 overflow-hidden p-4">
        {currentModule === 'tabs' && <TabManager />}
        {currentModule !== 'tabs' && (
          <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
            功能开发中...
          </div>
        )}
      </main>

      <Toast />
    </div>
  )
}

// Placeholder for tab sub panel (will be replaced in Task 4)
function TabSubPanel() {
  return <div className="text-sm text-[var(--color-text-muted)]">工作区</div>
}
```

- [ ] **Step 11: 创建 newtab.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Tab Workspace</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 12: 运行构建确认**

```bash
pnpm build
```

Expected: Build succeeds, outputs to `build/chrome/`

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add theme, stores, layout components (Sidebar, SubPanel, Toast)"
```

---

### Task 4: Tab 管理模块

**Files:**
- Create: `src/modules/tab-manager/tabStore.ts`
- Create: `src/modules/tab-manager/useTabs.ts`
- Create: `src/modules/tab-manager/TabCard.tsx`
- Create: `src/modules/tab-manager/WorkspacePanel.tsx`
- Create: `src/modules/tab-manager/TabActions.tsx`
- Create: `src/modules/tab-manager/TabManager.tsx`
- Create: `src/modules/tab-manager/__tests__/tabStore.test.ts`
- Create: `src/modules/tab-manager/__tests__/useTabs.test.ts`

- [ ] **Step 1: 创建 Tab Store**

```typescript
// src/modules/tab-manager/tabStore.ts
import { create } from 'zustand'
import type { TabInfo, Workspace, ClosedTab } from '@/types'

interface TabState {
  tabs: TabInfo[]
  workspaces: Workspace[]
  closedTabs: ClosedTab[]
  selectedTabIds: Set<number>
  activeWorkspaceId: string | 'all' | 'pinned'

  setTabs: (tabs: TabInfo[]) => void
  addWorkspace: (name: string) => void
  renameWorkspace: (id: string, name: string) => void
  deleteWorkspace: (id: string) => void
  addTabToWorkspace: (workspaceId: string, tabId: number) => void
  removeTabFromWorkspace: (workspaceId: string, tabId: number) => void
  selectTab: (tabId: number, multi?: boolean) => void
  clearSelection: () => void
  setActiveWorkspace: (id: string | 'all' | 'pinned') => void
  addClosedTab: (tab: TabInfo) => void
  restoreClosedTab: (index: number) => void
  clearClosedTabs: () => void
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [],
  workspaces: [],
  closedTabs: [],
  selectedTabIds: new Set(),
  activeWorkspaceId: 'all',

  setTabs: (tabs) => set({ tabs }),

  addWorkspace: (name) =>
    set((state) => ({
      workspaces: [
        ...state.workspaces,
        {
          id: crypto.randomUUID(),
          name,
          tabIds: [],
          createdAt: Date.now(),
        },
      ],
    })),

  renameWorkspace: (id, name) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === id ? { ...w, name } : w
      ),
    })),

  deleteWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== id),
    })),

  addTabToWorkspace: (workspaceId, tabId) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId && !w.tabIds.includes(tabId)
          ? { ...w, tabIds: [...w.tabIds, tabId] }
          : w
      ),
    })),

  removeTabFromWorkspace: (workspaceId, tabId) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId
          ? { ...w, tabIds: w.tabIds.filter((t) => t !== tabId) }
          : w
      ),
    })),

  selectTab: (tabId, multi) =>
    set((state) => {
      const newSet = multi ? new Set(state.selectedTabIds) : new Set()
      if (newSet.has(tabId)) {
        newSet.delete(tabId)
      } else {
        newSet.add(tabId)
      }
      return { selectedTabIds: newSet }
    }),

  clearSelection: () => set({ selectedTabIds: new Set() }),

  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

  addClosedTab: (tab) =>
    set((state) => {
      const newClosed = [{ tab, closedAt: Date.now() }, ...state.closedTabs]
      return { closedTabs: newClosed.slice(0, 20) }
    }),

  restoreClosedTab: (index) =>
    set((state) => {
      const closed = state.closedTabs[index]
      if (!closed) return state
      const newClosed = [...state.closedTabs]
      newClosed.splice(index, 1)
      return { closedTabs: newClosed }
    }),

  clearClosedTabs: () => set({ closedTabs: [] }),
}))
```

- [ ] **Step 2: 创建 useTabs Hook**

```typescript
// src/modules/tab-manager/useTabs.ts
import { useEffect, useCallback } from 'react'
import { useTabStore } from './tabStore'
import type { TabInfo } from '@/types'
import { isExtensionApiAvailable } from '@/utils/browser'

function normalizeTab(tab: chrome.tabs.Tab): TabInfo {
  return {
    id: tab.id ?? -1,
    title: tab.title ?? 'Untitled',
    url: tab.url ?? '',
    favIconUrl: tab.favIconUrl,
    pinned: tab.pinned ?? false,
    active: tab.active ?? false,
    windowId: tab.windowId ?? -1,
  }
}

export function useTabs() {
  const { setTabs, addClosedTab } = useTabStore()

  const fetchTabs = useCallback(async () => {
    if (!isExtensionApiAvailable()) return
    try {
      const tabs = await chrome.tabs.query({})
      setTabs(tabs.map(normalizeTab))
    } catch (err) {
      console.error('Failed to fetch tabs:', err)
    }
  }, [setTabs])

  const closeTab = useCallback(async (tabId: number) => {
    if (!isExtensionApiAvailable()) return
    const tabs = useTabStore.getState().tabs
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) addClosedTab(tab)
    await chrome.tabs.remove(tabId)
  }, [addClosedTab])

  const closeTabs = useCallback(async (tabIds: number[]) => {
    if (!isExtensionApiAvailable()) return
    for (const id of tabIds) {
      const tab = useTabStore.getState().tabs.find((t) => t.id === id)
      if (tab) addClosedTab(tab)
    }
    await chrome.tabs.remove(tabIds)
  }, [addClosedTab])

  const activateTab = useCallback(async (tabId: number) => {
    if (!isExtensionApiAvailable()) return
    await chrome.tabs.update(tabId, { active: true })
  }, [])

  useEffect(() => {
    fetchTabs()
    // Listen for tab changes
    if (isExtensionApiAvailable()) {
      chrome.tabs.onCreated.addListener(fetchTabs)
      chrome.tabs.onRemoved.addListener(fetchTabs)
      chrome.tabs.onUpdated.addListener(fetchTabs)
      return () => {
        chrome.tabs.onCreated.removeListener(fetchTabs)
        chrome.tabs.onRemoved.removeListener(fetchTabs)
        chrome.tabs.onUpdated.removeListener(fetchTabs)
      }
    }
  }, [fetchTabs])

  return { fetchTabs, closeTab, closeTabs, activateTab }
}
```

- [ ] **Step 3: 创建 TabCard 组件**

```typescript
// src/modules/tab-manager/TabCard.tsx
import { useCallback, useState } from 'react'
import type { TabInfo } from '@/types'
import { getFaviconUrl } from '@/utils/favicon'
import { X, Star, FolderOpen } from 'lucide-react'

interface TabCardProps {
  tab: TabInfo
  selected: boolean
  onSelect: (id: number, multi: boolean) => void
  onClose: (id: number) => void
  onActivate: (id: number) => void
}

export function TabCard({ tab, selected, onSelect, onClose, onActivate }: TabCardProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onSelect(tab.id, e.metaKey || e.ctrlKey)
      if (!selected) onActivate(tab.id)
    },
    [tab.id, selected, onSelect, onActivate]
  )

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
      style={{
        background: selected
          ? 'var(--color-active-bg)'
          : hovered
          ? 'var(--color-panel)'
          : 'var(--color-card-bg)',
        border: selected
          ? '1px solid var(--color-accent)'
          : '1px solid var(--color-border)',
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Favicon */}
      <img
        src={tab.favIconUrl || getFaviconUrl(tab.url, 16)}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getFaviconUrl('https://example.com', 16)
        }}
      />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" style={{ color: 'var(--color-text)' }}>
          {tab.title}
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
          {(() => {
            try {
              return new URL(tab.url).hostname
            } catch {
              return tab.url
            }
          })()}
        </div>
      </div>

      {/* Actions */}
      {hovered && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            title="收藏"
            className="p-1 rounded hover:bg-[var(--color-panel)]"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Star size={14} style={{ color: 'var(--color-text-muted)' }} />
          </button>
          <button
            title="关闭"
            className="p-1 rounded hover:bg-[var(--color-panel)]"
            onClick={(e) => {
              e.stopPropagation()
              onClose(tab.id)
            }}
          >
            <X size={14} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: 创建 WorkspacePanel 组件**

```typescript
// src/modules/tab-manager/WorkspacePanel.tsx
import { useState, useCallback } from 'react'
import { useTabStore } from './tabStore'
import { Plus, Folder } from 'lucide-react'

export function WorkspacePanel() {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, addWorkspace } = useTabStore()
  const [showInput, setShowInput] = useState(false)
  const [name, setName] = useState('')

  const handleCreate = useCallback(() => {
    if (name.trim()) {
      addWorkspace(name.trim())
      setName('')
      setShowInput(false)
    }
  }, [name, addWorkspace])

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`px-2 py-1.5 rounded-md cursor-pointer text-sm ${
          activeWorkspaceId === 'all' ? 'font-medium' : ''
        }`}
        style={{
          background: activeWorkspaceId === 'all' ? 'var(--color-active-bg)' : 'transparent',
          color: activeWorkspaceId === 'all' ? 'var(--color-accent)' : 'var(--color-text)',
        }}
        onClick={() => setActiveWorkspace('all')}
      >
        <div className="flex items-center gap-2">
          <Folder size={14} />
          <span>全部标签</span>
        </div>
      </div>

      {workspaces.map((w) => (
        <div
          key={w.id}
          className={`px-2 py-1.5 rounded-md cursor-pointer text-sm ${
            activeWorkspaceId === w.id ? 'font-medium' : ''
          }`}
          style={{
            background: activeWorkspaceId === w.id ? 'var(--color-active-bg)' : 'transparent',
            color: activeWorkspaceId === w.id ? 'var(--color-accent)' : 'var(--color-text)',
          }}
          onClick={() => setActiveWorkspace(w.id)}
        >
          <div className="flex items-center gap-2">
            <Folder size={14} />
            <span className="truncate flex-1">{w.name}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {w.tabIds.length}
            </span>
          </div>
        </div>
      ))}

      {showInput ? (
        <div className="flex gap-1 mt-1">
          <input
            className="flex-1 text-xs px-2 py-1 rounded border"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
            }}
            placeholder="工作区名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <button
            className="text-xs px-2 py-1 rounded"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
            onClick={handleCreate}
          >
            确定
          </button>
        </div>
      ) : (
        <button
          className="flex items-center gap-1 mt-2 text-xs px-2 py-1.5 rounded border border-dashed"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          onClick={() => setShowInput(true)}
        >
          <Plus size={12} />
          新建工作区
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 5: 创建 TabActions 批量操作组件**

```typescript
// src/modules/tab-manager/TabActions.tsx
import { useCallback } from 'react'
import { useTabStore } from './tabStore'
import { useTabs } from './useTabs'

export function TabActions() {
  const { selectedTabIds, clearSelection } = useTabStore()
  const { closeTabs } = useTabs()

  const count = selectedTabIds.size

  const handleCloseSelected = useCallback(async () => {
    await closeTabs(Array.from(selectedTabIds))
    clearSelection()
  }, [selectedTabIds, closeTabs, clearSelection])

  const handleSelectAll = useCallback(() => {
    // Select all tabs logic - simplified for now
  }, [])

  if (count === 0) return null

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
      style={{
        background: 'var(--color-active-bg)',
        border: '1px solid var(--color-accent)',
      }}
    >
      <span className="text-sm" style={{ color: 'var(--color-accent)' }}>
        已选择 {count} 个标签
      </span>
      <div className="flex gap-2 ml-auto">
        <button
          className="text-xs px-3 py-1 rounded"
          style={{
            background: '#e74c3c',
            color: '#fff',
          }}
          onClick={handleCloseSelected}
        >
          批量关闭
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 创建 TabManager 主页面**

```typescript
// src/modules/tab-manager/TabManager.tsx
import { useMemo, useState, useCallback } from 'react'
import { useTabStore } from './tabStore'
import { useTabs } from './useTabs'
import { TabCard } from './TabCard'
import { TabActions } from './TabActions'
import { Search } from 'lucide-react'

export function TabManager() {
  const { tabs, activeWorkspaceId, selectTab, clearSelection } = useTabStore()
  const { closeTab, activateTab } = useTabs()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTabs = useMemo(() => {
    let result = tabs
    // Filter by workspace
    if (activeWorkspaceId !== 'all') {
      // For now, show all tabs (workspace filtering will be enhanced later)
    }
    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.url.toLowerCase().includes(q)
      )
    }
    return result
  }, [tabs, activeWorkspaceId, searchQuery])

  const handleSearchClear = useCallback(() => {
    setSearchQuery('')
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Tab 管理
          <span
            className="ml-2 text-sm font-normal"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {tabs.length} 个标签
          </span>
        </h2>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            className="w-full pl-9 pr-8 py-2 rounded-lg text-sm border"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
            }}
            placeholder="搜索标签页..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
              onClick={handleSearchClear}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Batch actions */}
      <TabActions />

      {/* Tab grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredTabs.map((tab) => (
            <TabCard
              key={tab.id}
              tab={tab}
              selected={useTabStore.getState().selectedTabIds.has(tab.id)}
              onSelect={selectTab}
              onClose={closeTab}
              onActivate={activateTab}
            />
          ))}
        </div>
        {filteredTabs.length === 0 && (
          <div
            className="flex items-center justify-center h-40 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {searchQuery ? '未找到匹配的标签页' : '没有打开的标签页'}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: 更新 App.tsx 的 TabSubPanel**

将 App.tsx 中的 `TabSubPanel` 替换为真正的 `WorkspacePanel`：

```typescript
// src/App.tsx - 替换 TabSubPanel 函数
import { WorkspacePanel } from '@/modules/tab-manager/WorkspacePanel'

// ... 在 SubPanel 中：
<SubPanel>
  {currentModule === 'tabs' && <WorkspacePanel />}
</SubPanel>
```

- [ ] **Step 8: 创建 TabStore 测试**

```typescript
// src/modules/tab-manager/__tests__/tabStore.test.ts
import { useTabStore } from '@/modules/tab-manager/tabStore'

describe('tabStore', () => {
  beforeEach(() => {
    useTabStore.setState({
      tabs: [],
      workspaces: [],
      closedTabs: [],
      selectedTabIds: new Set(),
      activeWorkspaceId: 'all',
    })
  })

  it('adds a workspace', () => {
    useTabStore.getState().addWorkspace('Test Workspace')
    const workspaces = useTabStore.getState().workspaces
    expect(workspaces).toHaveLength(1)
    expect(workspaces[0].name).toBe('Test Workspace')
    expect(workspaces[0].id).toBeDefined()
  })

  it('renames a workspace', () => {
    useTabStore.getState().addWorkspace('Old Name')
    const workspace = useTabStore.getState().workspaces[0]
    useTabStore.getState().renameWorkspace(workspace.id, 'New Name')
    expect(useTabStore.getState().workspaces[0].name).toBe('New Name')
  })

  it('deletes a workspace', () => {
    useTabStore.getState().addWorkspace('To Delete')
    const workspace = useTabStore.getState().workspaces[0]
    useTabStore.getState().deleteWorkspace(workspace.id)
    expect(useTabStore.getState().workspaces).toHaveLength(0)
  })

  it('selects and deselects tabs', () => {
    useTabStore.getState().selectTab(1)
    expect(useTabStore.getState().selectedTabIds.has(1)).toBe(true)

    useTabStore.getState().selectTab(1) // deselect
    expect(useTabStore.getState().selectedTabIds.has(1)).toBe(false)
  })

  it('selects multiple tabs with multi flag', () => {
    useTabStore.getState().selectTab(1, true)
    useTabStore.getState().selectTab(2, true)
    expect(useTabStore.getState().selectedTabIds.size).toBe(2)
  })

  it('clears selection', () => {
    useTabStore.getState().selectTab(1)
    useTabStore.getState().selectTab(2, true)
    useTabStore.getState().clearSelection()
    expect(useTabStore.getState().selectedTabIds.size).toBe(0)
  })

  it('tracks closed tabs up to 20', () => {
    const mockTab = {
      id: 1,
      title: 'Test',
      url: 'https://test.com',
      pinned: false,
      active: false,
      windowId: 1,
    }
    useTabStore.getState().addClosedTab(mockTab)
    expect(useTabStore.getState().closedTabs).toHaveLength(1)
  })
})
```

- [ ] **Step 9: 创建 useTabs 测试**

```typescript
// src/modules/tab-manager/__tests__/useTabs.test.ts
import { renderHook } from '@testing-library/react'
import { useTabs } from '@/modules/tab-manager/useTabs'

describe('useTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides closeTab function', () => {
    const { result } = renderHook(() => useTabs())
    expect(typeof result.current.closeTab).toBe('function')
    expect(typeof result.current.closeTabs).toBe('function')
    expect(typeof result.current.activateTab).toBe('function')
    expect(typeof result.current.fetchTabs).toBe('function')
  })
})
```

- [ ] **Step 10: 运行测试**

```bash
pnpm test
```

Expected: All tests pass

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: implement Tab Manager module with workspace management and batch operations"
```

---

## Phase 2: 站点导航 + 搜索功能

### Task 5: 站点导航模块

**Files:**
- Create: `src/modules/site-nav/siteStore.ts`
- Create: `src/modules/site-nav/SiteCard.tsx`
- Create: `src/modules/site-nav/SiteGroup.tsx`
- Create: `src/modules/site-nav/AddSiteModal.tsx`
- Create: `src/modules/site-nav/SiteNav.tsx`
- Create: `src/modules/site-nav/__tests__/siteStore.test.ts`

- [ ] **Step 1: 创建站点 Store**

```typescript
// src/modules/site-nav/siteStore.ts
import { create } from 'zustand'
import type { Site, SiteGroup } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const SITES_KEY = 'ai-tab-sites'
const GROUPS_KEY = 'ai-tab-site-groups'

interface SiteState {
  sites: Site[]
  groups: SiteGroup[]
  activeGroupId: string | 'all'

  loadSites: () => Promise<void>
  addSite: (site: Omit<Site, 'id' | 'createdAt'>) => Promise<void>
  updateSite: (id: string, updates: Partial<Site>) => Promise<void>
  deleteSite: (id: string) => Promise<void>
  addGroup: (name: string) => Promise<void>
  renameGroup: (id: string, name: string) => Promise<void>
  deleteGroup: (id: string) => Promise<void>
  setActiveGroup: (id: string | 'all') => void
  reorderSite: (siteId: string, newOrder: number) => void
}

const defaultGroups: SiteGroup[] = [
  { id: 'work', name: '工作', order: 0 },
  { id: 'common', name: '常用', order: 1 },
  { id: 'entertainment', name: '娱乐', order: 2 },
]

export const useSiteStore = create<SiteState>((set, get) => ({
  sites: [],
  groups: defaultGroups,
  activeGroupId: 'all',

  loadSites: async () => {
    const sites = await getFromStorage<Site[]>(SITES_KEY, [])
    const groups = await getFromStorage<SiteGroup[]>(GROUPS_KEY, defaultGroups)
    set({ sites, groups })
  },

  addSite: async (site) => {
    const newSite: Site = {
      ...site,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    set((state) => {
      const updated = [...state.sites, newSite]
      saveToStorage(SITES_KEY, updated)
      return { sites: updated }
    })
  },

  updateSite: async (id, updates) => {
    set((state) => {
      const updated = state.sites.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      )
      saveToStorage(SITES_KEY, updated)
      return { sites: updated }
    })
  },

  deleteSite: async (id) => {
    set((state) => {
      const updated = state.sites.filter((s) => s.id !== id)
      saveToStorage(SITES_KEY, updated)
      return { sites: updated }
    })
  },

  addGroup: async (name) => {
    const newGroup: SiteGroup = {
      id: crypto.randomUUID(),
      name,
      order: get().groups.length,
    }
    set((state) => {
      const updated = [...state.groups, newGroup]
      saveToStorage(GROUPS_KEY, updated)
      return { groups: updated }
    })
  },

  renameGroup: async (id, name) => {
    set((state) => {
      const updated = state.groups.map((g) =>
        g.id === id ? { ...g, name } : g
      )
      saveToStorage(GROUPS_KEY, updated)
      return { groups: updated }
    })
  },

  deleteGroup: async (id) => {
    set((state) => {
      const updated = state.groups.filter((g) => g.id !== id)
      saveToStorage(GROUPS_KEY, updated)
      return { groups: updated }
    })
  },

  setActiveGroup: (id) => set({ activeGroupId: id }),

  reorderSite: (siteId, newOrder) => {
    set((state) => ({
      sites: state.sites.map((s) =>
        s.id === siteId ? { ...s, order: newOrder } : s
      ),
    }))
  },
}))
```

- [ ] **Step 2: 创建 SiteCard 组件**

```typescript
// src/modules/site-nav/SiteCard.tsx
import { useState } from 'react'
import type { Site } from '@/types'
import { getFaviconUrl } from '@/utils/favicon'
import { X, Edit2 } from 'lucide-react'

interface SiteCardProps {
  site: Site
  onDelete: (id: string) => void
  onEdit: (site: Site) => void
}

export function SiteCard({ site, onDelete, onEdit }: SiteCardProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    window.open(site.url, '_blank')
  }

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
      style={{
        background: hovered ? 'var(--color-panel)' : 'var(--color-card-bg)',
        border: `1px solid ${hovered ? 'var(--color-accent)' : 'var(--color-border)'}`,
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={getFaviconUrl(site.url, 16)}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getFaviconUrl('https://example.com', 16)
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" style={{ color: 'var(--color-text)' }}>
          {site.title}
        </div>
      </div>
      {hovered && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-1 rounded hover:bg-[var(--color-border)]"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(site)
            }}
          >
            <Edit2 size={12} style={{ color: 'var(--color-text-muted)' }} />
          </button>
          <button
            className="p-1 rounded hover:bg-[var(--color-border)]"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(site.id)
            }}
          >
            <X size={12} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 创建 SiteGroup 组件**

```typescript
// src/modules/site-nav/SiteGroup.tsx
import type { Site, SiteGroup as SiteGroupType } from '@/types'
import { SiteCard } from './SiteCard'

interface SiteGroupProps {
  group: SiteGroupType
  sites: Site[]
  onDeleteSite: (id: string) => void
  onEditSite: (site: Site) => void
}

export function SiteGroup({ group, sites, onDeleteSite, onEditSite }: SiteGroupProps) {
  const sortedSites = [...sites].sort((a, b) => a.order - b.order)

  return (
    <div className="mb-4">
      <h4
        className="text-sm font-medium mb-2"
        style={{ color: 'var(--color-text)' }}
      >
        {group.name}
        <span
          className="ml-1 text-xs font-normal"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ({sites.length})
        </span>
      </h4>
      <div className="flex flex-col gap-1">
        {sortedSites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            onDelete={onDeleteSite}
            onEdit={onEditSite}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 AddSiteModal 组件**

```typescript
// src/modules/site-nav/AddSiteModal.tsx
import { useState, useCallback } from 'react'
import type { SiteGroup } from '@/types'
import { X } from 'lucide-react'

interface AddSiteModalProps {
  groups: SiteGroup[]
  onAdd: (site: { title: string; url: string; groupId: string }) => void
  onClose: () => void
}

export function AddSiteModal({ groups, onAdd, onClose }: AddSiteModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [groupId, setGroupId] = useState(groups[0]?.id ?? '')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !url.trim()) return
      let processedUrl = url.trim()
      if (!processedUrl.startsWith('http')) {
        processedUrl = 'https://' + processedUrl
      }
      onAdd({ title: title.trim(), url: processedUrl, groupId })
      onClose()
    },
    [title, url, groupId, onAdd, onClose]
  )

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <div
        className="w-96 rounded-xl p-6"
        style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            添加站点
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--color-panel)]">
            <X size={16} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
              名称
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg text-sm border"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
              placeholder="站点名称"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
              链接
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg text-sm border"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
              分组
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg text-sm border"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-sm font-medium text-white mt-2"
            style={{
              background: 'var(--color-accent)',
            }}
          >
            添加
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 SiteNav 主页面**

```typescript
// src/modules/site-nav/SiteNav.tsx
import { useEffect, useState, useCallback } from 'react'
import { useSiteStore } from './siteStore'
import { SiteGroup } from './SiteGroup'
import { AddSiteModal } from './AddSiteModal'
import { Plus, Search } from 'lucide-react'
import type { Site } from '@/types'

export function SiteNav() {
  const {
    sites,
    groups,
    activeGroupId,
    setActiveGroup,
    loadSites,
    addSite,
    deleteSite,
  } = useSiteStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadSites()
  }, [loadSites])

  const filteredSites = sites.filter((s) => {
    const matchesGroup = activeGroupId === 'all' || s.groupId === activeGroupId
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.url.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGroup && matchesSearch
  })

  const handleAdd = useCallback(
    (site: { title: string; url: string; groupId: string }) => {
      addSite(site)
    },
    [addSite]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteSite(id)
    },
    [deleteSite]
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          站点导航
        </h2>
        <div className="flex-1 max-w-md relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            className="w-full pl-9 pr-8 py-2 rounded-lg text-sm border"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
            }}
            placeholder="搜索站点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-accent)' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          添加站点
        </button>
      </div>

      {/* Group filter tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            activeGroupId === 'all' ? 'font-medium' : ''
          }`}
          style={{
            background: activeGroupId === 'all' ? 'var(--color-accent)' : 'var(--color-panel)',
            color: activeGroupId === 'all' ? '#fff' : 'var(--color-text)',
          }}
          onClick={() => setActiveGroup('all')}
        >
          全部
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            className={`px-3 py-1 rounded-full text-sm ${
              activeGroupId === g.id ? 'font-medium' : ''
            }`}
            style={{
              background: activeGroupId === g.id ? 'var(--color-accent)' : 'var(--color-panel)',
              color: activeGroupId === g.id ? '#fff' : 'var(--color-text)',
            }}
            onClick={() => setActiveGroup(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Sites list */}
      <div className="flex-1 overflow-y-auto">
        {activeGroupId === 'all' ? (
          groups.map((group) => {
            const groupSites = filteredSites.filter((s) => s.groupId === group.id)
            if (groupSites.length === 0) return null
            return (
              <SiteGroup
                key={group.id}
                group={group}
                sites={groupSites}
                onDeleteSite={handleDelete}
                onEditSite={setEditingSite}
              />
            )
          })
        ) : (
          <div>
            {(() => {
              const group = groups.find((g) => g.id === activeGroupId)
              if (!group) return null
              return (
                <SiteGroup
                  group={group}
                  sites={filteredSites}
                  onDeleteSite={handleDelete}
                  onEditSite={setEditingSite}
                />
              )
            })()}
          </div>
        )}
        {filteredSites.length === 0 && (
          <div
            className="flex items-center justify-center h-40 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            暂无站点，点击上方"添加站点"开始
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSiteModal
          groups={groups}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 6: 更新 App.tsx 加入站点导航**

在 App.tsx 中添加：

```typescript
// 新增 import
import { SiteNav } from '@/modules/site-nav/SiteNav'

// 在 SubPanel 中添加
{currentModule === 'sites' && (
  <SubPanel>
    <div className="text-sm text-[var(--color-text-muted)]">分组管理</div>
  </SubPanel>
)}

// 在主内容区添加
{currentModule === 'sites' && <SiteNav />}
```

- [ ] **Step 7: 创建 siteStore 测试**

```typescript
// src/modules/site-nav/__tests__/siteStore.test.ts
import { useSiteStore } from '@/modules/site-nav/siteStore'

describe('siteStore', () => {
  beforeEach(() => {
    useSiteStore.setState({
      sites: [],
      groups: [
        { id: 'work', name: '工作', order: 0 },
        { id: 'common', name: '常用', order: 1 },
      ],
      activeGroupId: 'all',
    })
  })

  it('adds a site', async () => {
    await useSiteStore.getState().addSite({
      title: 'Google',
      url: 'https://google.com',
      groupId: 'common',
      order: 0,
    })
    expect(useSiteStore.getState().sites).toHaveLength(1)
    expect(useSiteStore.getState().sites[0].title).toBe('Google')
  })

  it('deletes a site', async () => {
    await useSiteStore.getState().addSite({
      title: 'Test',
      url: 'https://test.com',
      groupId: 'work',
      order: 0,
    })
    const site = useSiteStore.getState().sites[0]
    await useSiteStore.getState().deleteSite(site.id)
    expect(useSiteStore.getState().sites).toHaveLength(0)
  })

  it('adds a group', async () => {
    await useSiteStore.getState().addGroup('娱乐')
    expect(useSiteStore.getState().groups).toHaveLength(3)
    expect(useSiteStore.getState().groups[2].name).toBe('娱乐')
  })

  it('filters by active group', () => {
    useSiteStore.getState().setActiveGroup('work')
    expect(useSiteStore.getState().activeGroupId).toBe('work')
  })
})
```

- [ ] **Step 8: 运行测试**

```bash
pnpm test
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: implement Site Navigation module with groups, search, and add/delete"
```

---

## Phase 3: 在线音乐 + 个人相册

### Task 6: 在线音乐模块

**Files:**
- Create: `src/modules/music-player/MusicPlayer.tsx`
- Create: `src/modules/music-player/MusicEmbed.tsx`
- Create: `src/modules/music-player/MusicQuickLinks.tsx`

- [ ] **Step 1: 创建 MusicPlayer 主页面**

```typescript
// src/modules/music-player/MusicPlayer.tsx
import { useState, useCallback } from 'react'
import { MusicEmbed } from './MusicEmbed'
import { MusicQuickLinks } from './MusicQuickLinks'
import { Maximize2, Minimize2 } from 'lucide-react'

const PLATFORMS: Record<string, string> = {
  netease: 'https://music.163.com/#/discover/toplist',
  spotify: 'https://open.spotify.com',
  youtube: 'https://music.youtube.com',
  qq: 'https://y.qq.com',
  apple: 'https://music.apple.com',
}

export function MusicPlayer() {
  const [activePlatform, setActivePlatform] = useState('netease')
  const [fullscreen, setFullscreen] = useState(false)
  const [showQuickLinks, setShowQuickLinks] = useState(true)

  const toggleFullscreen = useCallback(() => {
    setFullscreen((prev) => !prev)
  }, [])

  if (fullscreen) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {PLATFORMS[activePlatform]}
          </span>
          <button
            className="p-1 rounded hover:bg-[var(--color-panel)]"
            onClick={toggleFullscreen}
          >
            <Minimize2 size={16} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>
        <MusicEmbed url={PLATFORMS[activePlatform]} />
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Main player area */}
      <div className="flex-1 flex flex-col">
        {/* Platform selector */}
        <div className="flex items-center gap-2 mb-3">
          {Object.entries(PLATFORMS).map(([key, _]) => (
            <button
              key={key}
              className={`px-3 py-1.5 rounded-full text-sm ${
                activePlatform === key ? 'font-medium' : ''
              }`}
              style={{
                background:
                  activePlatform === key
                    ? 'var(--color-accent)'
                    : 'var(--color-panel)',
                color: activePlatform === key ? '#fff' : 'var(--color-text)',
              }}
              onClick={() => setActivePlatform(key)}
            >
              {key}
            </button>
          ))}
          <div className="flex-1" />
          <button
            className="p-1.5 rounded-lg hover:bg-[var(--color-panel)]"
            onClick={toggleFullscreen}
          >
            <Maximize2 size={16} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>

        {/* Embedded player */}
        <div className="flex-1 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
          <MusicEmbed url={PLATFORMS[activePlatform]} />
        </div>
      </div>

      {/* Quick links sidebar */}
      {showQuickLinks && (
        <div
          className="w-56 ml-3 p-3 rounded-xl overflow-y-auto border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-card-bg)' }}
        >
          <MusicQuickLinks onSelect={(url) => setActivePlatform(PLATFORMS[activePlatform])} />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 创建 MusicEmbed 组件**

```typescript
// src/modules/music-player/MusicEmbed.tsx
import { useState } from 'react'

interface MusicEmbedProps {
  url: string
}

export function MusicEmbed({ url }: MusicEmbedProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full" style={{ background: 'var(--color-bg)' }}>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
          播放器加载失败
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-accent)' }}
          onClick={() => {
            setError(false)
            window.open(url, '_blank')
          }}
        >
          在新窗口打开
        </button>
      </div>
    )
  }

  return (
    <iframe
      src={url}
      className="w-full h-full border-0"
      allow="encrypted-media"
      onError={() => setError(true)}
    />
  )
}
```

- [ ] **Step 3: 创建 MusicQuickLinks 组件**

```typescript
// src/modules/music-player/MusicQuickLinks.tsx
import { Music } from 'lucide-react'

const QUICK_LINKS = [
  { name: '网易云音乐', url: 'https://music.163.com', color: '#c20c0c' },
  { name: 'QQ音乐', url: 'https://y.qq.com', color: '#31c27c' },
  { name: 'Spotify', url: 'https://open.spotify.com', color: '#1db954' },
  { name: 'YouTube Music', url: 'https://music.youtube.com', color: '#ff0000' },
  { name: 'Apple Music', url: 'https://music.apple.com', color: '#fc3c44' },
  { name: '酷狗音乐', url: 'https://www.kugou.com', color: '#2d8cf0' },
]

interface MusicQuickLinksProps {
  onSelect: (url: string) => void
}

export function MusicQuickLinks({ onSelect }: MusicQuickLinksProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
        快捷入口
      </h4>
      <div className="flex flex-col gap-2">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            style={{
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = link.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: link.color }}
            />
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 更新 App.tsx 加入音乐模块**

```typescript
// 新增 import
import { MusicPlayer } from '@/modules/music-player/MusicPlayer'

// 在主内容区添加
{currentModule === 'music' && <MusicPlayer />}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement Music Player module with iframe embed and platform quick links"
```

---

### Task 7: 个人相册模块

**Files:**
- Create: `src/modules/photo-album/photoStore.ts`
- Create: `src/modules/photo-album/PhotoGrid.tsx`
- Create: `src/modules/photo-album/PhotoPreview.tsx`
- Create: `src/modules/photo-album/PhotoUpload.tsx`
- Create: `src/modules/photo-album/PhotoAlbum.tsx`

- [ ] **Step 1: 创建相册 Store + IndexedDB**

```typescript
// src/modules/photo-album/photoStore.ts
import { create } from 'zustand'
import type { PhotoAlbum, Photo } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const ALBUMS_KEY = 'ai-tab-albums'
const PHOTOS_META_KEY = 'ai-tab-photos-meta'
const DB_NAME = 'ai-tab-photos'
const DB_VERSION = 1
const STORE_NAME = 'photos'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function savePhotoToDB(photo: Photo): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(photo)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function getPhotoFromDB(id: string): Promise<Photo | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function deletePhotoFromDB(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

const defaultAlbums: PhotoAlbum[] = [
  { id: 'all', name: '全部', order: 0 },
  { id: 'travel', name: '旅行', order: 1 },
  { id: 'work', name: '工作', order: 2 },
  { id: 'life', name: '生活', order: 3 },
]

interface PhotoState {
  albums: PhotoAlbum[]
  photos: Photo[]
  activeAlbumId: string
  previewPhoto: Photo | null

  loadPhotos: () => Promise<void>
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => Promise<void>
  deletePhoto: (id: string) => Promise<void>
  addAlbum: (name: string) => Promise<void>
  deleteAlbum: (id: string) => Promise<void>
  setActiveAlbum: (id: string) => void
  setPreviewPhoto: (photo: Photo | null) => void
}

export const usePhotoStore = create<PhotoState>((set) => ({
  albums: defaultAlbums,
  photos: [],
  activeAlbumId: 'all',
  previewPhoto: null,

  loadPhotos: async () => {
    const albums = await getFromStorage<PhotoAlbum[]>(ALBUMS_KEY, defaultAlbums)
    const photos = await getFromStorage<Photo[]>(PHOTOS_META_KEY, [])
    set({ albums, photos })
  },

  addPhoto: async (photo) => {
    const newPhoto: Photo = {
      ...photo,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    await savePhotoToDB(newPhoto)
    set((state) => {
      const updated = [...state.photos, newPhoto]
      saveToStorage(PHOTOS_META_KEY, updated)
      return { photos: updated }
    })
  },

  deletePhoto: async (id) => {
    await deletePhotoFromDB(id)
    set((state) => {
      const updated = state.photos.filter((p) => p.id !== id)
      saveToStorage(PHOTOS_META_KEY, updated)
      return { photos: updated }
    })
  },

  addAlbum: async (name) => {
    const newAlbum: PhotoAlbum = {
      id: crypto.randomUUID(),
      name,
      order: get().albums.length,
    }
    set((state) => {
      const updated = [...state.albums, newAlbum]
      saveToStorage(ALBUMS_KEY, updated)
      return { albums: updated }
    })
  },

  deleteAlbum: async (id) => {
    set((state) => {
      const updated = state.albums.filter((a) => a.id !== id && a.id !== 'all')
      saveToStorage(ALBUMS_KEY, updated)
      return { albums: updated }
    })
  },

  setActiveAlbum: (id) => set({ activeAlbumId: id }),
  setPreviewPhoto: (photo) => set({ previewPhoto: photo }),
}))
```

- [ ] **Step 2: 创建 PhotoUpload 组件**

```typescript
// src/modules/photo-album/PhotoUpload.tsx
import { useCallback, useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface PhotoUploadProps {
  onUpload: (files: File[]) => void
  albumId: string
}

export function PhotoUpload({ onUpload, albumId }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      )
      if (files.length > 0) onUpload(files)
    },
    [onUpload]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) onUpload(files)
    },
    [onUpload]
  )

  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors"
      style={{ borderColor: 'var(--color-border)' }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <Upload size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        拖拽图片到这里，或点击上传
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
```

- [ ] **Step 3: 创建 PhotoGrid 组件**

```typescript
// src/modules/photo-album/PhotoGrid.tsx
import type { Photo } from '@/types'

interface PhotoGridProps {
  photos: Photo[]
  onPreview: (photo: Photo) => void
  onDelete: (id: string) => void
}

export function PhotoGrid({ photos, onPreview, onDelete }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer border"
          style={{ borderColor: 'var(--color-border)' }}
          onClick={() => onPreview(photo)}
        >
          <img
            src={photo.thumbnail}
            alt={photo.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-end">
            <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
              <span className="text-xs text-white truncate">{photo.name}</span>
              <button
                className="text-xs text-white hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(photo.id)
                }}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: 创建 PhotoPreview 组件**

```typescript
// src/modules/photo-album/PhotoPreview.tsx
import type { Photo } from '@/types'
import { X, Download, ArrowLeft } from 'lucide-react'

interface PhotoPreviewProps {
  photo: Photo
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function PhotoPreview({ photo, onClose, onPrev, onNext }: PhotoPreviewProps) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = photo.dataUrl ?? photo.thumbnail
    a.download = photo.name
    a.click()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      {/* Navigation */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
      >
        <ArrowLeft size={24} />
      </button>

      {/* Image */}
      <img
        src={photo.dataUrl ?? photo.thumbnail}
        alt={photo.name}
        className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Actions */}
      <div className="absolute right-4 top-4 flex gap-2">
        <button
          className="p-2 rounded-full text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
        >
          <Download size={20} />
        </button>
        <button
          className="p-2 rounded-full text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 PhotoAlbum 主页面**

```typescript
// src/modules/photo-album/PhotoAlbum.tsx
import { useEffect, useCallback, useState } from 'react'
import { usePhotoStore } from './photoStore'
import { PhotoGrid } from './PhotoGrid'
import { PhotoPreview } from './PhotoPreview'
import { PhotoUpload } from './PhotoUpload'
import type { Photo } from '@/types'

export function PhotoAlbum() {
  const {
    albums,
    photos,
    activeAlbumId,
    previewPhoto,
    loadPhotos,
    addPhoto,
    deletePhoto,
    setActiveAlbum,
    setPreviewPhoto,
  } = usePhotoStore()
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const filteredPhotos =
    activeAlbumId === 'all'
      ? photos
      : photos.filter((p) => p.albumId === activeAlbumId)

  const handleUpload = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        await addPhoto({
          albumId: activeAlbumId === 'all' ? 'life' : activeAlbumId,
          name: file.name,
          thumbnail: dataUrl,
          dataUrl,
        })
      }
      setShowUpload(false)
    },
    [addPhoto, activeAlbumId]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deletePhoto(id)
    },
    [deletePhoto]
  )

  const previewIndex = previewPhoto
    ? filteredPhotos.findIndex((p) => p.id === previewPhoto.id)
    : -1

  const handlePrev = useCallback(() => {
    if (previewIndex > 0) {
      setPreviewPhoto(filteredPhotos[previewIndex - 1])
    }
  }, [previewIndex, filteredPhotos, setPreviewPhoto])

  const handleNext = useCallback(() => {
    if (previewIndex < filteredPhotos.length - 1) {
      setPreviewPhoto(filteredPhotos[previewIndex + 1])
    }
  }, [previewIndex, filteredPhotos, setPreviewPhoto])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          个人相册
        </h2>
        {/* Album filter */}
        <div className="flex gap-2">
          {albums.map((album) => (
            <button
              key={album.id}
              className={`px-3 py-1 rounded-full text-sm ${
                activeAlbumId === album.id ? 'font-medium' : ''
              }`}
              style={{
                background:
                  activeAlbumId === album.id
                    ? 'var(--color-accent)'
                    : 'var(--color-panel)',
                color: activeAlbumId === album.id ? '#fff' : 'var(--color-text)',
              }}
              onClick={() => setActiveAlbum(album.id)}
            >
              {album.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          className="px-3 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-accent)' }}
          onClick={() => setShowUpload(!showUpload)}
        >
          上传图片
        </button>
      </div>

      {/* Upload area */}
      {showUpload && (
        <div className="mb-4">
          <PhotoUpload onUpload={handleUpload} albumId={activeAlbumId} />
        </div>
      )}

      {/* Photo grid */}
      <div className="flex-1 overflow-y-auto">
        <PhotoGrid
          photos={filteredPhotos}
          onPreview={setPreviewPhoto}
          onDelete={handleDelete}
        />
        {filteredPhotos.length === 0 && !showUpload && (
          <div
            className="flex items-center justify-center h-40 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            暂无图片，点击"上传图片"添加照片
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewPhoto && (
        <PhotoPreview
          photo={previewPhoto}
          onClose={() => setPreviewPhoto(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 6: 更新 App.tsx 加入相册模块**

```typescript
// 新增 import
import { PhotoAlbum } from '@/modules/photo-album/PhotoAlbum'

// 在主内容区添加
{currentModule === 'photos' && <PhotoAlbum />}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement Photo Album module with IndexedDB storage, upload, grid, and preview"
```

---

## Phase 4: 设置 + 跨浏览器打包 + 测试

### Task 8: 设置模块

**Files:**
- Create: `src/modules/settings/Settings.tsx`
- Create: `src/modules/settings/AppearancePanel.tsx`
- Create: `src/modules/settings/DataPanel.tsx`

- [ ] **Step 1: 创建 Settings 主页面**

```typescript
// src/modules/settings/Settings.tsx
import { useState } from 'react'
import { AppearancePanel } from './AppearancePanel'
import { DataPanel } from './DataPanel'

type SettingsTab = 'appearance' | 'data' | 'about'

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance')

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'appearance', label: '外观' },
    { id: 'data', label: '数据' },
    { id: 'about', label: '关于' },
  ]

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
        设置
      </h2>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === tab.id ? 'font-medium' : ''
            }`}
            style={{
              background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-muted)',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-lg">
        {activeTab === 'appearance' && <AppearancePanel />}
        {activeTab === 'data' && <DataPanel />}
        {activeTab === 'about' && <AboutPanel />}
      </div>
    </div>
  )
}

function AboutPanel() {
  return (
    <div className="text-sm space-y-3" style={{ color: 'var(--color-text)' }}>
      <p>
        <strong>AI Tab Workspace</strong> v1.0.0
      </p>
      <p style={{ color: 'var(--color-text-muted)' }}>
        个人办公提效工作台 - Tab管理、站点导航、在线音乐、个人相册
      </p>
      <p>
        支持的浏览器：Chrome、Edge、Safari
      </p>
    </div>
  )
}
```

- [ ] **Step 2: 创建 AppearancePanel 组件**

```typescript
// src/modules/settings/AppearancePanel.tsx
import { useCallback } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

const PRESET_COLORS = [
  '#e8a87c', // warm orange
  '#667eea', // blue
  '#27ae60', // green
  '#e74c3c', // red
  '#8e44ad', // purple
]

export function AppearancePanel() {
  const { theme, updateSetting } = useSettingsStore()

  const handleColorChange = useCallback(
    (color: string) => {
      updateSetting('theme', { ...theme, primaryColor: color })
      document.documentElement.style.setProperty('--color-accent', color)
    },
    [theme, updateSetting]
  )

  const handleFontSizeChange = useCallback(
    (size: 'small' | 'medium' | 'large') => {
      updateSetting('theme', { ...theme, fontSize: size })
      const sizes = { small: '14px', medium: '16px', large: '18px' }
      document.documentElement.style.fontSize = sizes[size]
    },
    [theme, updateSetting]
  )

  return (
    <div className="space-y-6">
      {/* Theme color */}
      <div>
        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          主题色
        </h4>
        <div className="flex gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                background: color,
                borderColor: theme.primaryColor === color ? color : 'transparent',
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Font size */}
      <div>
        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          字体大小
        </h4>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              className={`px-4 py-2 rounded-lg text-sm ${
                theme.fontSize === size ? 'font-medium' : ''
              }`}
              style={{
                background:
                  theme.fontSize === size
                    ? 'var(--color-accent)'
                    : 'var(--color-panel)',
                color: theme.fontSize === size ? '#fff' : 'var(--color-text)',
              }}
              onClick={() => handleFontSizeChange(size)}
            >
              {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建 DataPanel 组件**

```typescript
// src/modules/settings/DataPanel.tsx
import { useCallback } from 'react'
import { useToastStore } from '@/components/Toast'

export function DataPanel() {
  const { showToast } = useToastStore()

  const handleExport = useCallback(async () => {
    const data = {
      settings: localStorage.getItem('ai-tab-settings'),
      sites: localStorage.getItem('ai-tab-sites'),
      groups: localStorage.getItem('ai-tab-site-groups'),
      albums: localStorage.getItem('ai-tab-albums'),
      photosMeta: localStorage.getItem('ai-tab-photos-meta'),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-tab-workspace-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('配置已导出', 'success')
  }, [showToast])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const data = JSON.parse(text)
        if (data.settings) localStorage.setItem('ai-tab-settings', data.settings)
        if (data.sites) localStorage.setItem('ai-tab-sites', data.sites)
        if (data.groups) localStorage.setItem('ai-tab-site-groups', data.groups)
        if (data.albums) localStorage.setItem('ai-tab-albums', data.albums)
        if (data.photosMeta) localStorage.setItem('ai-tab-photos-meta', data.photosMeta)
        showToast('配置已导入，请刷新页面', 'success')
      } catch {
        showToast('导入失败：文件格式错误', 'error')
      }
    }
    input.click()
  }, [showToast])

  const handleClearAll = useCallback(() => {
    if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      localStorage.clear()
      showToast('所有数据已清除，请刷新页面', 'success')
    }
  }, [showToast])

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          导出配置
        </h4>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          将当前所有配置导出为 JSON 文件，可用于备份或迁移
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-accent)' }}
          onClick={handleExport}
        >
          导出配置
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          导入配置
        </h4>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          从 JSON 文件导入配置，将覆盖当前配置
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-text)' }}
          onClick={handleImport}
        >
          导入配置
        </button>
      </div>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h4 className="text-sm font-medium mb-2 text-red-600">
          危险操作
        </h4>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          清除所有本地数据，包括站点收藏、相册图片等
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600"
          onClick={handleClearAll}
        >
          清除所有数据
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 更新 App.tsx 加入设置模块**

```typescript
// 新增 import
import { Settings } from '@/modules/settings/Settings'

// 在主内容区添加
{currentModule === 'settings' && <Settings />}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement Settings module with appearance, data export/import, and about"
```

---

### Task 9: 最终集成 + 多浏览器构建

**Files:**
- Modify: `src/App.tsx` (整合所有模块)
- Modify: `manifest.json` (如有调整)

- [ ] **Step 1: 确保 App.tsx 包含所有模块路由**

最终的 App.tsx 应该包含所有 5 个模块的条件渲染。

- [ ] **Step 2: 执行所有构建**

```bash
pnpm build:chrome
pnpm build:edge
pnpm build:safari
```

Expected: 3 builds succeed, output to `build/chrome/`, `build/edge/`, `build/safari/`

- [ ] **Step 3: 运行全部测试**

```bash
pnpm test
```

- [ ] **Step 4: 在浏览器中测试**

在 Chrome 中加载 `build/chrome/` 目录作为开发者模式扩展：
1. 打开 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `build/chrome/` 目录
5. 打开新标签页验证

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: final integration, multi-browser builds, and testing"
```

---
