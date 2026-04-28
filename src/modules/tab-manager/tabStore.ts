import { create } from 'zustand'
import type { TabInfo, Workspace, ClosedTab } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const PINNED_KEY = 'ai-tab-pinned-tabs'

interface TabState {
  tabs: TabInfo[]
  workspaces: Workspace[]
  closedTabs: ClosedTab[]
  selectedTabIds: Set<number>
  pinnedTabIds: Set<number>
  activeWorkspaceId: string | 'all' | 'pinned'

  setTabs: (tabs: TabInfo[]) => void
  loadPinnedTabs: () => Promise<void>
  togglePinnedTab: (tabId: number) => Promise<void>
  isTabPinned: (tabId: number) => boolean
  removePinnedTabIds: (tabIds: number[]) => Promise<void>
  addWorkspace: (name: string) => void
  renameWorkspace: (id: string, name: string) => void
  deleteWorkspace: (id: string) => void
  addTabToWorkspace: (workspaceId: string, tabId: number) => void
  removeTabFromWorkspace: (workspaceId: string, tabId: number) => void
  selectTab: (tabId: number, multi?: boolean) => void
  selectAll: (tabIds: number[]) => void
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
  pinnedTabIds: new Set(),
  activeWorkspaceId: 'all',

  setTabs: (tabs) => set({ tabs }),

  loadPinnedTabs: async () => {
    const pinned = await getFromStorage<number[]>(PINNED_KEY, [])
    set({ pinnedTabIds: new Set(pinned) })
  },

  togglePinnedTab: async (tabId) => {
    set((state) => {
      const newSet = new Set(state.pinnedTabIds)
      if (newSet.has(tabId)) {
        newSet.delete(tabId)
      } else {
        newSet.add(tabId)
      }
      saveToStorage(PINNED_KEY, Array.from(newSet))
      return { pinnedTabIds: newSet }
    })
  },

  isTabPinned: (tabId) => {
    return get().pinnedTabIds.has(tabId)
  },

  removePinnedTabIds: async (tabIds) => {
    set((state) => {
      const newSet = new Set(state.pinnedTabIds)
      let changed = false
      for (const id of tabIds) {
        if (newSet.has(id)) {
          newSet.delete(id)
          changed = true
        }
      }
      if (changed) {
        saveToStorage(PINNED_KEY, Array.from(newSet))
      }
      return { pinnedTabIds: newSet }
    })
  },

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

  selectTab: (tabId) =>
    set((state) => {
      const newSet = new Set(state.selectedTabIds)
      if (newSet.has(tabId)) {
        newSet.delete(tabId)
      } else {
        newSet.add(tabId)
      }
      return { selectedTabIds: newSet }
    }),

  selectAll: (tabIds) =>
    set(() => ({ selectedTabIds: new Set(tabIds) })),

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
