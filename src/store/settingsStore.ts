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
        cacheOptions: updated.cacheOptions,
        language: updated.language,
      })
      return updated
    })
  },
  setFullSettings: async (settings) => {
    await saveSettings(settings)
    set({ ...settings, loaded: true })
  },
}))
