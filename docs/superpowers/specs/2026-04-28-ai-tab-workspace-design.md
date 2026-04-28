# 个人办公提效工作台 - 浏览器插件设计文档

**日期**: 2026-04-28
**状态**: 待审核

---

## 概述

开发一套跨浏览器（Chrome、Edge、Safari）的浏览器插件，定位为个人办公提效工作台。插件覆盖浏览器新标签页，提供 Tab 管理、站点导航、在线音乐、个人相册等功能模块。

---

## 技术栈

| 类别 | 选型 |
|------|------|
| UI 框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| 路由 | React Router 6 |
| 状态管理 | Zustand |
| 样式 | TailwindCSS + CSS 自定义变量 |
| 跨浏览器兼容 | webextension-polyfill |
| 图标 | Lucide React |
| 包管理 | pnpm |
| Manifest | Manifest V3 |

---

## 架构设计

### 整体结构

```
新标签页 (newtab.html)
├── React SPA (Single Page Application)
│   ├── 左侧图标侧栏（固定 60px）
│   │   ├── Logo
│   │   ├── Tab 管理图标
│   │   ├── 站点导航图标
│   │   ├── 在线音乐图标
│   │   ├── 个人相册图标
│   │   └── 设置图标（底部）
│   └── 二级面板（可选，200px）
│       └── 当前模块的子导航/列表
│   └── 主内容区（剩余空间）
│       └── 动态渲染各模块内容
└── 背景色：暖白渐变 (#fefcf6 → #f7f3eb)
```

### 文件结构

```
├── manifest.json              # Manifest V3 配置
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── public/
│   ├── newtab.html            # 新标签页入口
│   ├── icons/                 # 插件图标（16/32/48/128）
│   └── favicon.ico
├── src/
│   ├── main.tsx               # React 入口
│   ├── App.tsx                # 根组件 + 路由
│   ├── styles/
│   │   ├── globals.css        # 全局样式 + CSS 变量
│   │   └── theme.css          # 暖色纸质感主题变量
│   ├── components/
│   │   ├── Sidebar.tsx        # 左侧图标侧栏
│   │   ├── SubPanel.tsx       # 二级面板
│   │   ├── SearchBar.tsx      # 顶部搜索栏
│   │   └── Toast.tsx          # 全局提示组件
│   ├── modules/
│   │   ├── tab-manager/
│   │   │   ├── TabManager.tsx      # Tab 管理主页面
│   │   │   ├── TabCard.tsx         # 标签卡片组件
│   │   │   ├── WorkspacePanel.tsx  # 工作区筛选面板
│   │   │   ├── TabActions.tsx      # 批量操作组件
│   │   │   ├── useTabs.ts          # Tab API hook
│   │   │   └── tabStore.ts         # Tab 相关 Zustand store
│   │   ├── site-nav/
│   │   │   ├── SiteNav.tsx         # 站点导航主页面
│   │   │   ├── SiteCard.tsx        # 站点卡片
│   │   │   ├── SiteGroup.tsx       # 站点分组
│   │   │   ├── AddSiteModal.tsx    # 添加站点弹窗
│   │   │   └── siteStore.ts        # 站点 Zustand store
│   │   ├── music-player/
│   │   │   ├── MusicPlayer.tsx     # 音乐播放器主页面
│   │   │   ├── MusicEmbed.tsx      # 内嵌播放器 iframe
│   │   │   └── MusicQuickLinks.tsx # 音乐平台快捷入口
│   │   ├── photo-album/
│   │   │   ├── PhotoAlbum.tsx      # 相册主页面
│   │   │   ├── PhotoGrid.tsx       # 图片网格
│   │   │   ├── PhotoPreview.tsx    # 图片预览
│   │   │   ├── PhotoUpload.tsx     # 图片上传
│   │   │   └── photoStore.ts       # 相册 Zustand store
│   │   └── settings/
│   │       ├── Settings.tsx        # 设置主页面
│   │       ├── AppearancePanel.tsx # 外观设置
│   │       └── DataPanel.tsx       # 数据管理
│   ├── hooks/
│   │   ├── useBrowserType.ts   # 检测浏览器类型
│   │   └── useStorage.ts       # 统一存储 hook（含降级）
│   ├── store/
│   │   ├── uiStore.ts          # UI 全局状态（当前模块、侧栏折叠等）
│   │   └── settingsStore.ts    # 用户设置状态
│   ├── utils/
│   │   ├── storage.ts          # 存储封装（sync/local/IDB 回退）
│   │   ├── browser.ts          # 浏览器兼容性检测
│   │   └── favicon.ts          # 获取网站 favicon
│   └── types/
│       └── index.ts            # 全局类型定义
└── build/                      # 构建输出目录
    ├── chrome/                 # Chrome/Edge 构建产物
    └── safari/                 # Safari 适配产物
```

---

## 模块详细设计

### 1. Tab 管理模块

**功能**：
- 通过 `chrome.tabs.query({})` 获取所有打开的标签页
- 卡片网格布局展示，显示 favicon、标题、域名
- 顶部标签筛选：全部 / 按工作区 / 已收藏
- 搜索框按标题或域名过滤
- 卡片右键菜单：关闭、收藏、移动到工作区
- 批量操作：全选 → 批量关闭/移动
- 工作区管理：新建、重命名、删除，标签拖入工作区
- 支持关闭后批量恢复（临时缓存最近关闭的 20 个标签）

**数据流**：
```
chrome.tabs API → useTabs hook → Zustand store → TabCard 渲染
用户操作 → TabActions → chrome.tabs API → store 更新
```

### 2. 站点导航模块

**功能**：
- 用户自定义收藏站点，按分组管理
- 站点信息：URL、标题、favicon（自动获取）
- 支持拖拽排序和拖拽换组
- 顶部搜索栏集成常用搜索引擎（Google、Bing、百度）
- 导入/导出浏览器书签
- 站点卡片点击直接打开新标签

**存储**：`chrome.storage.sync`（跨设备同步）

### 3. 在线音乐模块

**功能**：
- 内嵌 iframe 播放器（默认嵌入 NetEase Cloud Music 网页版）
- 播放器区域占主内容区大部分面积
- 底部控制栏：平台切换、全屏切换
- 右侧快捷入口：Spotify、YouTube Music、Apple Music、QQ音乐等

**注意**：不做音乐播放逻辑，仅作为快捷入口和 iframe 容器。

### 4. 个人相册模块

**功能**：
- 相册分组管理（旅行、工作、生活等）
- 图片上传（拖拽上传、文件选择器）
- 图片网格展示，点击预览大图
- 图片操作：下载、删除、移动分组
- 支持设置某张图片为新标签页背景
- 数据存储：IndexedDB（原图）+ localStorage（缩略图元数据）

**存储**：
- 大图 → IndexedDB（无 5MB 限制）
- 缩略图和元数据 → `chrome.storage.local`
- 分组配置 → `chrome.storage.sync`

### 5. 设置模块

**功能**：
- 外观：主题色选择（预设 5 色 + 自定义）、背景图上传/清除、字体大小
- 数据：导入/导出全部配置（JSON）、清除所有数据
- 快捷键：配置常用操作的快捷键
- 关于：版本号、浏览器兼容性状态

---

## 跨浏览器兼容

### 兼容层
- 使用 `webextension-polyfill` 将 `chrome.*` API 转换为 `browser.*` Promise 风格
- 构建时通过 `webextension-polyfill-ts` 自动生成类型

### 构建策略
```
vite.config.ts
├── build:chrome    → output: build/chrome/
├── build:edge      → output: build/edge/（同 chrome）
└── build:safari    → output: build/safari/（xcodebuild 辅助）
```

### Safari 特殊处理
- Safari 需要通过 Xcode 转换为 `.xcodeproj`，在插件中提供说明文档
- Safari 的 `chrome_url_overrides.newtab` 可能需要用户手动启用，首次启动显示引导

---

## 错误处理

| 场景 | 处理方式 |
|------|----------|
| chrome API 不可用（非浏览器环境） | 显示开发模式提示，使用 mock 数据 |
| storage 写入失败 | 降级到 localStorage |
| 权限被拒绝 | 引导用户到扩展管理页面授权 |
| Safari 功能不支持 | 隐藏该功能入口 + 提示说明 |
| IndexedDB 满 | 提示清理，回退到仅存元数据 |
| iframe 加载失败（音乐/相册背景） | 显示占位图和重试按钮 |

---

## 权限声明

`manifest.json` permissions：
```json
{
  "permissions": [
    "tabs",
    "storage",
    "favicon"
  ],
  "host_permissions": [
    "<all_urls>"
  ]
}
```

---

## 开发计划阶段

1. **阶段一**：项目初始化 + Tab 管理（核心功能）
2. **阶段二**：站点导航 + 搜索功能
3. **阶段三**：在线音乐 + 个人相册
4. **阶段四**：设置 + 跨浏览器打包 + 测试
