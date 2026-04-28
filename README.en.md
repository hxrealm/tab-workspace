# Tab Workspace

> Personal productivity workspace — Tab Manager, Site Navigation, Music, Photo Album

## Features

- **Tab Manager** — Manage all open tabs, pin favorites, batch close, per-tab cache clearing
- **Site Navigation** — Pre-populated site shortcuts by category, add/edit/delete sites, locale-aware defaults (40+ CN sites / 37+ international sites)
- **Music Player** — Quick access to 7 music platforms (NetEase, QQ, Spotify, YouTube Music, Apple Music, etc.) with polished SVG brand icons
- **Photo Album** — Personal photo gallery with drag-and-drop upload, IndexedDB storage
- **Settings** — Theme customization, data export/import, configurable cache clearing options, multi-language support

## Tech Stack

- React 18 + TypeScript + Vite 5
- Zustand for state management
- TailwindCSS with CSS variables for theming
- Manifest V3 browser extension
- IndexedDB for photo storage, chrome.storage for settings

## Installation

1. Run `pnpm build:chrome` (or `pnpm build:edge` / `pnpm build:safari`)
2. Open your browser's extension management page
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Safari: Convert via `xcrun safari-web-extension-converter`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `build/chrome` (or corresponding) directory

## Development

```bash
pnpm install       # Install dependencies
pnpm dev           # Start dev server
pnpm test          # Run tests
pnpm build:chrome  # Build for Chrome
```

## Multi-language Support

Supports English, Simplified Chinese, and Traditional Chinese. Default language is detected from browser locale. Change language in Settings.

## License

[MIT](LICENSE)
