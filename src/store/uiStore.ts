import { create } from 'zustand'
import type { ModuleId } from '@/types'

interface UiState {
  currentModule: ModuleId
  sidebarCollapsed: boolean
  setModule: (module: ModuleId) => void
}

export const useUiStore = create<UiState>((set) => ({
  currentModule: 'tabs',
  sidebarCollapsed: false,
  setModule: (module) => set({ currentModule: module }),
}))
