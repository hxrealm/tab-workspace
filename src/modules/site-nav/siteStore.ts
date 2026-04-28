import { create } from 'zustand'
import type { Site, SiteGroup } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'
import { getLocale } from '@/i18n'

const SITES_KEY = 'ai-tab-sites'
const GROUPS_KEY = 'ai-tab-site-groups'
const VERSION_KEY = 'ai-tab-sites-version'
const SITES_VERSION = 2 // Bump when defaults change

interface SiteState {
  sites: Site[]
  groups: SiteGroup[]
  activeGroupId: string | 'all'

  loadSites: () => Promise<void>
  addSite: (site: { title: string; url: string; groupId: string; order?: number }) => Promise<void>
  updateSite: (id: string, updates: Partial<Site>) => Promise<void>
  deleteSite: (id: string) => Promise<void>
  addGroup: (name: string) => Promise<void>
  renameGroup: (id: string, name: string) => Promise<void>
  deleteGroup: (id: string) => Promise<void>
  setActiveGroup: (id: string | 'all') => void
  reorderSite: (siteId: string, newOrder: number) => void
}

// Group ID → i18n key mapping
const GROUP_I18N_KEY: Record<string, string> = {
  search: 'group.search',
  social: 'group.social',
  productivity: 'group.productivity',
  dev: 'group.dev',
  news: 'group.news',
  entertainment: 'group.entertainment',
  shopping: 'group.shopping',
}

// Group translation overrides (used when i18n is not available in store context)
const GROUP_NAMES: Record<string, Record<string, string>> = {
  'en': {
    search: 'Search',
    social: 'Social',
    productivity: 'Productivity',
    dev: 'Developer',
    news: 'News',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
  },
  'zh-CN': {
    search: '搜索引擎',
    social: '社交媒体',
    productivity: '办公学习',
    dev: '开发技术',
    news: '新闻资讯',
    entertainment: '影视娱乐',
    shopping: '购物',
  },
  'zh-TW': {
    search: '搜尋引擎',
    social: '社群媒體',
    productivity: '辦公學習',
    dev: '開發技術',
    news: '新聞資訊',
    entertainment: '影視娛樂',
    shopping: '購物',
  },
}

const DEFAULT_GROUPS: SiteGroup[] = [
  { id: 'search', name: '', order: 0 },
  { id: 'social', name: '', order: 1 },
  { id: 'productivity', name: '', order: 2 },
  { id: 'dev', name: '', order: 3 },
  { id: 'news', name: '', order: 4 },
  { id: 'entertainment', name: '', order: 5 },
  { id: 'shopping', name: '', order: 6 },
]

const CN_SITES: Omit<Site, 'id' | 'createdAt'>[] = [
  { title: '百度', url: 'https://www.baidu.com', groupId: 'search', order: 0 },
  { title: '必应', url: 'https://cn.bing.com', groupId: 'search', order: 1 },
  { title: '搜狗', url: 'https://www.sogou.com', groupId: 'search', order: 2 },
  { title: '360 搜索', url: 'https://www.so.com', groupId: 'search', order: 3 },
  { title: '微信', url: 'https://wx.qq.com', groupId: 'social', order: 0 },
  { title: '微博', url: 'https://weibo.com', groupId: 'social', order: 1 },
  { title: '小红书', url: 'https://www.xiaohongshu.com', groupId: 'social', order: 2 },
  { title: '知乎', url: 'https://www.zhihu.com', groupId: 'social', order: 3 },
  { title: '豆瓣', url: 'https://www.douban.com', groupId: 'social', order: 4 },
  { title: '飞书', url: 'https://www.feishu.cn', groupId: 'productivity', order: 0 },
  { title: '钉钉', url: 'https://www.dingtalk.com', groupId: 'productivity', order: 1 },
  { title: '企业微信', url: 'https://work.weixin.qq.com', groupId: 'productivity', order: 2 },
  { title: '腾讯文档', url: 'https://docs.qq.com', groupId: 'productivity', order: 3 },
  { title: '金山文档', url: 'https://www.kdocs.cn', groupId: 'productivity', order: 4 },
  { title: '石墨文档', url: 'https://shimo.im', groupId: 'productivity', order: 5 },
  { title: '百度网盘', url: 'https://pan.baidu.com', groupId: 'productivity', order: 6 },
  { title: 'GitHub', url: 'https://github.com', groupId: 'dev', order: 0 },
  { title: 'Gitee', url: 'https://gitee.com', groupId: 'dev', order: 1 },
  { title: '掘金', url: 'https://juejin.cn', groupId: 'dev', order: 2 },
  { title: 'CSDN', url: 'https://blog.csdn.net', groupId: 'dev', order: 3 },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', groupId: 'dev', order: 4 },
  { title: 'V2EX', url: 'https://www.v2ex.com', groupId: 'dev', order: 5 },
  { title: 'ChatGPT', url: 'https://chat.openai.com', groupId: 'dev', order: 6 },
  { title: '通义千问', url: 'https://tongyi.aliyun.com', groupId: 'dev', order: 7 },
  { title: '今日头条', url: 'https://www.toutiao.com', groupId: 'news', order: 0 },
  { title: '澎湃新闻', url: 'https://www.thepaper.cn', groupId: 'news', order: 1 },
  { title: '36氪', url: 'https://36kr.com', groupId: 'news', order: 2 },
  { title: '虎嗅', url: 'https://www.huxiu.com', groupId: 'news', order: 3 },
  { title: '新浪新闻', url: 'https://news.sina.com.cn', groupId: 'news', order: 4 },
  { title: 'Bilibili', url: 'https://www.bilibili.com', groupId: 'entertainment', order: 0 },
  { title: '抖音', url: 'https://www.douyin.com', groupId: 'entertainment', order: 1 },
  { title: '爱奇艺', url: 'https://www.iqiyi.com', groupId: 'entertainment', order: 2 },
  { title: '腾讯视频', url: 'https://v.qq.com', groupId: 'entertainment', order: 3 },
  { title: '优酷', url: 'https://www.youku.com', groupId: 'entertainment', order: 4 },
  { title: '网易云音乐', url: 'https://music.163.com', groupId: 'entertainment', order: 5 },
  { title: '淘宝', url: 'https://www.taobao.com', groupId: 'shopping', order: 0 },
  { title: '京东', url: 'https://www.jd.com', groupId: 'shopping', order: 1 },
  { title: '拼多多', url: 'https://www.pinduoduo.com', groupId: 'shopping', order: 2 },
  { title: '闲鱼', url: 'https://www.goofish.com', groupId: 'shopping', order: 3 },
]

const INTL_SITES: Omit<Site, 'id' | 'createdAt'>[] = [
  { title: 'Google', url: 'https://www.google.com', groupId: 'search', order: 0 },
  { title: 'Bing', url: 'https://www.bing.com', groupId: 'search', order: 1 },
  { title: 'DuckDuckGo', url: 'https://duckduckgo.com', groupId: 'search', order: 2 },
  { title: 'Wikipedia', url: 'https://www.wikipedia.org', groupId: 'search', order: 3 },
  { title: 'X (Twitter)', url: 'https://x.com', groupId: 'social', order: 0 },
  { title: 'Facebook', url: 'https://www.facebook.com', groupId: 'social', order: 1 },
  { title: 'Instagram', url: 'https://www.instagram.com', groupId: 'social', order: 2 },
  { title: 'LinkedIn', url: 'https://www.linkedin.com', groupId: 'social', order: 3 },
  { title: 'Reddit', url: 'https://www.reddit.com', groupId: 'social', order: 4 },
  { title: 'Threads', url: 'https://www.threads.net', groupId: 'social', order: 5 },
  { title: 'Gmail', url: 'https://mail.google.com', groupId: 'productivity', order: 0 },
  { title: 'Google Drive', url: 'https://drive.google.com', groupId: 'productivity', order: 1 },
  { title: 'Google Docs', url: 'https://docs.google.com', groupId: 'productivity', order: 2 },
  { title: 'Google Sheets', url: 'https://sheets.google.com', groupId: 'productivity', order: 3 },
  { title: 'Notion', url: 'https://www.notion.so', groupId: 'productivity', order: 4 },
  { title: 'Slack', url: 'https://slack.com', groupId: 'productivity', order: 5 },
  { title: 'Microsoft 365', url: 'https://www.office.com', groupId: 'productivity', order: 6 },
  { title: 'Zoom', url: 'https://zoom.us', groupId: 'productivity', order: 7 },
  { title: 'GitHub', url: 'https://github.com', groupId: 'dev', order: 0 },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', groupId: 'dev', order: 1 },
  { title: 'ChatGPT', url: 'https://chat.openai.com', groupId: 'dev', order: 2 },
  { title: 'Claude', url: 'https://claude.ai', groupId: 'dev', order: 3 },
  { title: 'Vercel', url: 'https://vercel.com', groupId: 'dev', order: 4 },
  { title: 'npm', url: 'https://www.npmjs.com', groupId: 'dev', order: 5 },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', groupId: 'dev', order: 6 },
  { title: 'AWS Console', url: 'https://console.aws.amazon.com', groupId: 'dev', order: 7 },
  { title: 'Hacker News', url: 'https://news.ycombinator.com', groupId: 'news', order: 0 },
  { title: 'BBC News', url: 'https://www.bbc.com/news', groupId: 'news', order: 1 },
  { title: 'The Verge', url: 'https://www.theverge.com', groupId: 'news', order: 2 },
  { title: 'Ars Technica', url: 'https://arstechnica.com', groupId: 'news', order: 3 },
  { title: 'TechCrunch', url: 'https://techcrunch.com', groupId: 'news', order: 4 },
  { title: 'YouTube', url: 'https://www.youtube.com', groupId: 'entertainment', order: 0 },
  { title: 'Netflix', url: 'https://www.netflix.com', groupId: 'entertainment', order: 1 },
  { title: 'Spotify', url: 'https://open.spotify.com', groupId: 'entertainment', order: 2 },
  { title: 'Twitch', url: 'https://www.twitch.tv', groupId: 'entertainment', order: 3 },
  { title: 'Amazon', url: 'https://www.amazon.com', groupId: 'shopping', order: 0 },
  { title: 'eBay', url: 'https://www.ebay.com', groupId: 'shopping', order: 1 },
]

function getLocaleForGroups(): string {
  const stored = localStorage.getItem('ai-tab-locale')
  if (stored && (stored === 'zh-CN' || stored === 'zh-TW' || stored === 'en')) return stored
  const nav = navigator.language || 'en'
  if (nav.startsWith('zh-TW') || nav.startsWith('zh-HK')) return 'zh-TW'
  if (nav.startsWith('zh')) return 'zh-CN'
  return 'en'
}

function getDefaults(locale: string) {
  const isCn = locale === 'zh-CN' || locale === 'zh-TW'
  return {
    groups: DEFAULT_GROUPS,
    groupNames: GROUP_NAMES[locale] ?? GROUP_NAMES.en,
    sites: isCn ? CN_SITES : INTL_SITES,
  }
}

function localizeGroups(groups: SiteGroup[], locale: string): SiteGroup[] {
  const defaults = getDefaults(locale)
  return groups.map((g) => ({
    ...g,
    name: defaults.groupNames[g.id] || g.name,
  }))
}

export const useSiteStore = create<SiteState>((set, get) => ({
  sites: [],
  groups: [],
  activeGroupId: 'all',

  loadSites: async () => {
    const locale = getLocaleForGroups()
    const defaults = getDefaults(locale)

    // Load version from storage
    const storedVersion = await getFromStorage<number>(VERSION_KEY, 0)

    // Load stored groups (just IDs and order, names come from i18n)
    let storedGroups = await getFromStorage<SiteGroup[]>(GROUPS_KEY, [])
    if (storedGroups.length === 0) {
      storedGroups = defaults.groups
    }

    // Apply localized names to all groups
    const groups = localizeGroups(storedGroups, locale)
    saveToStorage(GROUPS_KEY, groups)

    // Load stored sites
    let sites = await getFromStorage<Site[]>(SITES_KEY, [])

    // Seed default sites if empty OR version changed (migration)
    if (sites.length === 0 || storedVersion < SITES_VERSION) {
      sites = defaults.sites.map((s, i) => ({
        ...s,
        id: crypto.randomUUID(),
        createdAt: Date.now() + i,
      }))
      saveToStorage(SITES_KEY, sites)
      saveToStorage(VERSION_KEY, SITES_VERSION)
    }

    set({ sites, groups })
  },

  addSite: async (site) => {
    const newSite: Site = {
      ...site,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      order: (site as Site).order ?? 0,
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
