export type Locale = 'en' | 'zh-CN' | 'zh-TW'

export interface Translations {
  // Sidebar
  'sidebar.tabs': string
  'sidebar.sites': string
  'sidebar.music': string
  'sidebar.photos': string
  'sidebar.settings': string

  // App
  'app.comingSoon': string

  // Tab Manager
  'tabManager.title': string
  'tabManager.count': string
  'tabManager.all': string
  'tabManager.pinned': string
  'tabManager.unpinned': string
  'tabManager.search': string
  'tabManager.noResults': string
  'tabManager.noTabs': string
  'tabManager.noPinned': string
  'tabManager.closeAll': string
  'tabManager.confirmCloseAll': string
  'tabManager.pinnedSuccess': string
  'tabManager.unpinnedSuccess': string

  // Tab Card
  'tabCard.pin': string
  'tabCard.unpin': string
  'tabCard.saveForLater': string
  'tabCard.removeLater': string
  'tabCard.clearCache': string
  'tabCard.close': string
  'tabCard.cacheCleared': string
  'tabCard.cacheFailed': string
  'tabCard.cacheNoAddress': string

  // Tab Actions
  'tabActions.selected': string
  'tabActions.closeBatch': string
  'tabActions.openBatch': string
  'tabActions.openAll': string
  'tabActions.closeAll': string

  // Site Nav
  'siteNav.title': string
  'siteNav.search': string
  'siteNav.addSite': string
  'siteNav.all': string
  'siteNav.noSites': string

  // Site Group Names
  'group.search': string
  'group.social': string
  'group.productivity': string
  'group.dev': string
  'group.news': string
  'group.entertainment': string
  'group.shopping': string

  // Add Site Modal
  'addSite.addTitle': string
  'addSite.editTitle': string
  'addSite.name': string
  'addSite.namePlaceholder': string
  'addSite.url': string
  'addSite.urlPlaceholder': string
  'addSite.group': string
  'addSite.save': string
  'addSite.add': string

  // Music Player
  'music.title': string
  'music.hint': string

  // Photo Album
  'photos.title': string
  'photos.upload': string
  'photos.empty': string
  'photos.delete': string
  'photos.uploadDrop': string
  'photos.album.all': string
  'photos.album.travel': string
  'photos.album.work': string
  'photos.album.life': string

  // Settings
  'settings.title': string
  'settings.appearance': string
  'settings.data': string
  'settings.cache': string
  'settings.about': string

  // Appearance Panel
  'appearance.color': string
  'appearance.fontSize': string
  'appearance.small': string
  'appearance.medium': string
  'appearance.large': string

  // Data Panel
  'data.exportTitle': string
  'data.exportDesc': string
  'data.exportBtn': string
  'data.importTitle': string
  'data.importDesc': string
  'data.importBtn': string
  'data.dangerTitle': string
  'data.dangerDesc': string
  'data.clearAll': string
  'data.exportSuccess': string
  'data.importSuccess': string
  'data.importError': string
  'data.confirmClear': string
  'data.clearSuccess': string

  // Cache Panel
  'cache.title': string
  'cache.description': string
  'cache.cookies': string
  'cache.localStorage': string
  'cache.sessionStorage': string
  'cache.indexedDB': string
  'cache.cache': string
  'cache.cacheStorage': string
  'cache.serviceWorkers': string

  // Workspace Panel
  'workspace.allTabs': string
  'workspace.newName': string
  'workspace.confirm': string
  'workspace.new': string

  // About Panel
  'about.version': string
  'about.description': string
  'about.browsers': string
}

type LocaleMap = Record<Locale, Translations>

export const translations: LocaleMap = {
  en: {
    'sidebar.tabs': 'Tab Manager',
    'sidebar.sites': 'Site Navigation',
    'sidebar.music': 'Music',
    'sidebar.photos': 'Photo Album',
    'sidebar.settings': 'Settings',

    'app.comingSoon': 'Coming soon...',

    'tabManager.title': 'Tab Manager',
    'tabManager.count': '{count} tabs',
    'tabManager.all': 'All',
    'tabManager.pinned': 'Pinned',
    'tabManager.unpinned': 'Unpinned',
    'tabManager.search': 'Search tabs...',
    'tabManager.noResults': 'No matching tabs found',
    'tabManager.noTabs': 'No open tabs',
    'tabManager.noPinned': 'No pinned tabs yet',
    'tabManager.closeAll': 'Close All',
    'tabManager.confirmCloseAll': 'Close all {count} tabs?',
    'tabManager.pinnedSuccess': 'Pinned',
    'tabManager.unpinnedSuccess': 'Unpinned',

    'tabCard.pin': 'Pin',
    'tabCard.unpin': 'Unpin',
    'tabCard.saveForLater': 'Save for later',
    'tabCard.removeLater': 'Remove',
    'tabCard.clearCache': 'Clear site cache',
    'tabCard.close': 'Close',
    'tabCard.cacheCleared': 'Site cache cleared',
    'tabCard.cacheFailed': 'Failed to clear cache',
    'tabCard.cacheNoAddress': 'Unable to get site address',

    'tabActions.selected': '{count} selected',
    'tabActions.closeBatch': 'Close selected',
    'tabActions.openBatch': 'Open selected',
    'tabActions.openAll': 'Open all',
    'tabActions.closeAll': 'Close all',

    'siteNav.title': 'Site Navigation',
    'siteNav.search': 'Search sites...',
    'siteNav.addSite': 'Add Site',
    'siteNav.all': 'All',
    'siteNav.noSites': 'No sites yet. Click "Add Site" to get started.',

    'group.search': 'Search',
    'group.social': 'Social',
    'group.productivity': 'Productivity',
    'group.dev': 'Developer',
    'group.news': 'News',
    'group.entertainment': 'Entertainment',
    'group.shopping': 'Shopping',

    'addSite.addTitle': 'Add Site',
    'addSite.editTitle': 'Edit Site',
    'addSite.name': 'Name',
    'addSite.namePlaceholder': 'Site name',
    'addSite.url': 'URL',
    'addSite.urlPlaceholder': 'https://...',
    'addSite.group': 'Group',
    'addSite.save': 'Save',
    'addSite.add': 'Add',

    'music.title': 'Music',
    'music.hint': 'Click a card to open the music platform in a new window',

    'photos.title': 'Photo Album',
    'photos.upload': 'Upload',
    'photos.empty': 'No photos yet. Click "Upload" to add photos.',
    'photos.delete': 'Delete',
    'photos.uploadDrop': 'Drag images here, or click to upload',
    'photos.album.all': 'All',
    'photos.album.travel': 'Travel',
    'photos.album.work': 'Work',
    'photos.album.life': 'Life',

    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.data': 'Data',
    'settings.cache': 'Cache',
    'settings.about': 'About',

    'appearance.color': 'Theme color',
    'appearance.fontSize': 'Font size',
    'appearance.small': 'Small',
    'appearance.medium': 'Medium',
    'appearance.large': 'Large',

    'data.exportTitle': 'Export Config',
    'data.exportDesc': 'Export all configurations as a JSON file for backup or migration.',
    'data.exportBtn': 'Export Config',
    'data.importTitle': 'Import Config',
    'data.importDesc': 'Import configuration from a JSON file. This will overwrite your current config.',
    'data.importBtn': 'Import Config',
    'data.dangerTitle': 'Danger Zone',
    'data.dangerDesc': 'Clear all local data, including site bookmarks, photo albums, etc.',
    'data.clearAll': 'Clear All Data',
    'data.exportSuccess': 'Config exported',
    'data.importSuccess': 'Config imported. Please refresh the page.',
    'data.importError': 'Import failed: invalid file format',
    'data.confirmClear': 'Are you sure you want to clear all data? This cannot be undone.',
    'data.clearSuccess': 'All data cleared. Please refresh the page.',

    'cache.title': 'Tab Cache Clear Options',
    'cache.description': 'Configure what data is cleared when clicking the cache clear button on a tab card.',
    'cache.cookies': 'Cookies',
    'cache.localStorage': 'LocalStorage',
    'cache.sessionStorage': 'SessionStorage',
    'cache.indexedDB': 'IndexedDB',
    'cache.cache': 'Browser Cache',
    'cache.cacheStorage': 'Cache Storage',
    'cache.serviceWorkers': 'Service Workers',

    'workspace.allTabs': 'All Tabs',
    'workspace.newName': 'Workspace name',
    'workspace.confirm': 'Confirm',
    'workspace.new': 'New Workspace',

    'about.version': 'v1.0.0',
    'about.description': 'Personal productivity workspace — Tab Manager, Site Navigation, Music, Photo Album',
    'about.browsers': 'Supported browsers: Chrome, Edge, Safari',
  },

  'zh-CN': {
    'sidebar.tabs': 'Tab 管理',
    'sidebar.sites': '站点导航',
    'sidebar.music': '在线音乐',
    'sidebar.photos': '个人相册',
    'sidebar.settings': '设置',

    'app.comingSoon': '功能开发中...',

    'tabManager.title': 'Tab 管理',
    'tabManager.count': '{count} 个标签',
    'tabManager.all': '全部',
    'tabManager.pinned': '已收藏',
    'tabManager.unpinned': '未收藏',
    'tabManager.search': '搜索标签页...',
    'tabManager.noResults': '未找到匹配的标签页',
    'tabManager.noTabs': '没有打开的标签页',
    'tabManager.noPinned': '暂无已收藏标签',
    'tabManager.closeAll': '关闭全部',
    'tabManager.confirmCloseAll': '确定要关闭全部 {count} 个标签页吗？',
    'tabManager.pinnedSuccess': '已收藏',
    'tabManager.unpinnedSuccess': '已取消收藏',

    'tabCard.pin': '收藏',
    'tabCard.unpin': '取消收藏',
    'tabCard.saveForLater': '稍后保存',
    'tabCard.removeLater': '移除',
    'tabCard.clearCache': '清除站点缓存',
    'tabCard.close': '关闭',
    'tabCard.cacheCleared': '已清除站点缓存',
    'tabCard.cacheFailed': '清除缓存失败',
    'tabCard.cacheNoAddress': '无法获取站点地址',

    'tabActions.selected': '已选择 {count} 个标签',
    'tabActions.closeBatch': '批量关闭',
    'tabActions.openBatch': '批量打开',
    'tabActions.openAll': '全部打开',
    'tabActions.closeAll': '全部关闭',

    'siteNav.title': '站点导航',
    'siteNav.search': '搜索站点...',
    'siteNav.addSite': '添加站点',
    'siteNav.all': '全部',
    'siteNav.noSites': '暂无站点，点击上方"添加站点"开始',

    'group.search': '搜索引擎',
    'group.social': '社交媒体',
    'group.productivity': '办公学习',
    'group.dev': '开发技术',
    'group.news': '新闻资讯',
    'group.entertainment': '影视娱乐',
    'group.shopping': '购物',

    'addSite.addTitle': '添加站点',
    'addSite.editTitle': '编辑站点',
    'addSite.name': '名称',
    'addSite.namePlaceholder': '站点名称',
    'addSite.url': '链接',
    'addSite.urlPlaceholder': 'https://...',
    'addSite.group': '分组',
    'addSite.save': '保存',
    'addSite.add': '添加',

    'music.title': '在线音乐',
    'music.hint': '点击卡片将在新窗口打开音乐平台',

    'photos.title': '个人相册',
    'photos.upload': '上传图片',
    'photos.empty': '暂无图片，点击"上传图片"添加照片',
    'photos.delete': '删除',
    'photos.uploadDrop': '拖拽图片到这里，或点击上传',
    'photos.album.all': '全部',
    'photos.album.travel': '旅行',
    'photos.album.work': '工作',
    'photos.album.life': '生活',

    'settings.title': '设置',
    'settings.appearance': '外观',
    'settings.data': '数据',
    'settings.cache': '缓存',
    'settings.about': '关于',

    'appearance.color': '主题色',
    'appearance.fontSize': '字体大小',
    'appearance.small': '小',
    'appearance.medium': '中',
    'appearance.large': '大',

    'data.exportTitle': '导出配置',
    'data.exportDesc': '将当前所有配置导出为 JSON 文件，可用于备份或迁移。',
    'data.exportBtn': '导出配置',
    'data.importTitle': '导入配置',
    'data.importDesc': '从 JSON 文件导入配置，将覆盖当前配置。',
    'data.importBtn': '导入配置',
    'data.dangerTitle': '危险操作',
    'data.dangerDesc': '清除所有本地数据，包括站点收藏、相册图片等。',
    'data.clearAll': '清除所有数据',
    'data.exportSuccess': '配置已导出',
    'data.importSuccess': '配置已导入，请刷新页面',
    'data.importError': '导入失败：文件格式错误',
    'data.confirmClear': '确定要清除所有数据吗？此操作不可撤销。',
    'data.clearSuccess': '所有数据已清除，请刷新页面',

    'cache.title': 'Tab 清除缓存选项',
    'cache.description': '配置点击 Tab 卡片上的清除缓存按钮时会清除哪些数据。',
    'cache.cookies': 'Cookies',
    'cache.localStorage': 'LocalStorage',
    'cache.sessionStorage': 'SessionStorage',
    'cache.indexedDB': 'IndexedDB',
    'cache.cache': '浏览器缓存 (Cache)',
    'cache.cacheStorage': 'Cache Storage',
    'cache.serviceWorkers': 'Service Workers',

    'workspace.allTabs': '全部标签',
    'workspace.newName': '工作区名称',
    'workspace.confirm': '确定',
    'workspace.new': '新建工作区',

    'about.version': 'v1.0.0',
    'about.description': '个人办公提效工作台 — Tab 管理、站点导航、在线音乐、个人相册',
    'about.browsers': '支持的浏览器：Chrome、Edge、Safari',
  },

  'zh-TW': {
    'sidebar.tabs': 'Tab 管理',
    'sidebar.sites': '網站導覽',
    'sidebar.music': '線上音樂',
    'sidebar.photos': '個人相簿',
    'sidebar.settings': '設定',

    'app.comingSoon': '功能開發中...',

    'tabManager.title': 'Tab 管理',
    'tabManager.count': '{count} 個分頁',
    'tabManager.all': '全部',
    'tabManager.pinned': '已收藏',
    'tabManager.unpinned': '未收藏',
    'tabManager.search': '搜尋分頁...',
    'tabManager.noResults': '未找到符合的分頁',
    'tabManager.noTabs': '沒有開啟的分頁',
    'tabManager.noPinned': '暫無已收藏分頁',
    'tabManager.closeAll': '關閉全部',
    'tabManager.confirmCloseAll': '確定要關閉全部 {count} 個分頁嗎？',
    'tabManager.pinnedSuccess': '已收藏',
    'tabManager.unpinnedSuccess': '已取消收藏',

    'tabCard.pin': '收藏',
    'tabCard.unpin': '取消收藏',
    'tabCard.saveForLater': '稍後儲存',
    'tabCard.removeLater': '移除',
    'tabCard.clearCache': '清除網站快取',
    'tabCard.close': '關閉',
    'tabCard.cacheCleared': '已清除網站快取',
    'tabCard.cacheFailed': '清除快取失敗',
    'tabCard.cacheNoAddress': '無法取得網站位址',

    'tabActions.selected': '已選擇 {count} 個分頁',
    'tabActions.closeBatch': '批次關閉',
    'tabActions.openBatch': '批次開啟',
    'tabActions.openAll': '全部開啟',
    'tabActions.closeAll': '全部關閉',

    'siteNav.title': '網站導覽',
    'siteNav.search': '搜尋網站...',
    'siteNav.addSite': '新增網站',
    'siteNav.all': '全部',
    'siteNav.noSites': '尚無網站，點擊上方"新增網站"開始',

    'group.search': '搜尋引擎',
    'group.social': '社群媒體',
    'group.productivity': '辦公學習',
    'group.dev': '開發技術',
    'group.news': '新聞資訊',
    'group.entertainment': '影視娛樂',
    'group.shopping': '購物',

    'addSite.addTitle': '新增網站',
    'addSite.editTitle': '編輯網站',
    'addSite.name': '名稱',
    'addSite.namePlaceholder': '網站名稱',
    'addSite.url': '連結',
    'addSite.urlPlaceholder': 'https://...',
    'addSite.group': '分類',
    'addSite.save': '儲存',
    'addSite.add': '新增',

    'music.title': '線上音樂',
    'music.hint': '點擊卡片將在新視窗開啟音樂平台',

    'photos.title': '個人相簿',
    'photos.upload': '上傳圖片',
    'photos.empty': '尚無圖片，點擊"上傳圖片"新增照片',
    'photos.delete': '刪除',
    'photos.uploadDrop': '拖曳圖片到此處，或點擊上傳',
    'photos.album.all': '全部',
    'photos.album.travel': '旅行',
    'photos.album.work': '工作',
    'photos.album.life': '生活',

    'settings.title': '設定',
    'settings.appearance': '外觀',
    'settings.data': '資料',
    'settings.cache': '快取',
    'settings.about': '關於',

    'appearance.color': '主題色',
    'appearance.fontSize': '字型大小',
    'appearance.small': '小',
    'appearance.medium': '中',
    'appearance.large': '大',

    'data.exportTitle': '匯出設定',
    'data.exportDesc': '將當前所有設定匯出為 JSON 檔案，可用於備份或遷移。',
    'data.exportBtn': '匯出設定',
    'data.importTitle': '匯入設定',
    'data.importDesc': '從 JSON 檔案匯入設定，將覆蓋當前設定。',
    'data.importBtn': '匯入設定',
    'data.dangerTitle': '危險操作',
    'data.dangerDesc': '清除所有本機資料，包括網站收藏、相簿圖片等。',
    'data.clearAll': '清除所有資料',
    'data.exportSuccess': '設定已匯出',
    'data.importSuccess': '設定已匯入，請重新整理頁面',
    'data.importError': '匯入失敗：檔案格式錯誤',
    'data.confirmClear': '確定要清除所有資料嗎？此操作無法復原。',
    'data.clearSuccess': '所有資料已清除，請重新整理頁面',

    'cache.title': 'Tab 清除快取選項',
    'cache.description': '設定點擊 Tab 卡片上的清除快取按鈕時會清除哪些資料。',
    'cache.cookies': 'Cookies',
    'cache.localStorage': 'LocalStorage',
    'cache.sessionStorage': 'SessionStorage',
    'cache.indexedDB': 'IndexedDB',
    'cache.cache': '瀏覽器快取 (Cache)',
    'cache.cacheStorage': 'Cache Storage',
    'cache.serviceWorkers': 'Service Workers',

    'workspace.allTabs': '全部分頁',
    'workspace.newName': '工作區名稱',
    'workspace.confirm': '確定',
    'workspace.new': '新建工作區',

    'about.version': 'v1.0.0',
    'about.description': '個人辦公提效工作台 — Tab 管理、網站導覽、線上音樂、個人相簿',
    'about.browsers': '支援的瀏覽器：Chrome、Edge、Safari',
  },
}

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
}
