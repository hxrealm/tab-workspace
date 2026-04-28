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
