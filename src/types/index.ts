import type { Locale } from '@/i18n/translations'

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

export interface CacheClearOptions {
  cache: boolean
  cacheStorage: boolean
  serviceWorkers: boolean
  cookies: boolean
  localStorage: boolean
  sessionStorage: boolean
  indexedDB: boolean
}

export const DEFAULT_CACHE_OPTIONS: CacheClearOptions = {
  cache: false,
  cacheStorage: false,
  serviceWorkers: false,
  cookies: true,
  localStorage: true,
  sessionStorage: true,
  indexedDB: true,
}

export interface AppSettings {
  theme: {
    primaryColor: string
    backgroundUrl: string
    fontSize: 'small' | 'medium' | 'large'
  }
  searchEngine: 'google' | 'bing' | 'baidu'
  musicPlatform: string
  cacheOptions: CacheClearOptions
  language: Locale
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: {
    primaryColor: '#e8a87c',
    backgroundUrl: '',
    fontSize: 'medium',
  },
  searchEngine: 'google',
  musicPlatform: 'netease',
  cacheOptions: DEFAULT_CACHE_OPTIONS,
  language: 'en',
}

export interface ClosedTab {
  tab: TabInfo
  closedAt: number
}
