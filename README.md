# Tab Workspace

> 个人办公提效工作台 — Tab 管理、站点导航、在线音乐、个人相册

## 功能

- **Tab 管理** — 管理所有打开的标签页，收藏常用页面，批量关闭，逐个清除站点缓存
- **站点导航** — 按分类预设站点快捷方式，支持添加/编辑/删除，根据语言自动切换默认站点（国内 40+ / 国际 37+）
- **在线音乐** — 快捷访问 7 个音乐平台（网易云、QQ、酷狗、酷我、Spotify、YouTube Music、Apple Music），精美 SVG 品牌图标
- **个人相册** — 个人照片画廊，支持拖拽上传，IndexedDB 本地存储
- **设置** — 主题自定义、数据导出/导入、可配置缓存清除选项、多语言支持

## 技术栈

- React 18 + TypeScript + Vite 5
- Zustand 状态管理
- TailwindCSS + CSS 变量主题
- Manifest V3 浏览器扩展
- IndexedDB 照片存储，chrome.storage 设置存储

## 安装

1. 运行 `pnpm build:chrome`（或 `pnpm build:edge` / `pnpm build:safari`）
2. 打开浏览器扩展管理页面
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Safari: 使用 `xcrun safari-web-extension-converter` 转换
3. 启用 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择 `build/chrome`（或对应）目录

## 开发

```bash
pnpm install       # 安装依赖
pnpm dev           # 启动开发服务器
pnpm test          # 运行测试
pnpm build:chrome  # 构建 Chrome 版本
```

## 多语言支持

支持英语、简体中文、繁体中文。默认语言根据浏览器语言自动检测，可在设置页面切换。

## License

[MIT](LICENSE)
