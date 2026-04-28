import { useEffect, useCallback } from 'react'
import { useTabStore } from './tabStore'
import type { TabInfo } from '@/types'
import { isExtensionApiAvailable } from '@/utils/browser'

function normalizeTab(tab: chrome.tabs.Tab): TabInfo {
  return {
    id: tab.id ?? -1,
    title: tab.title ?? 'Untitled',
    url: tab.url ?? '',
    favIconUrl: tab.favIconUrl,
    pinned: tab.pinned ?? false,
    active: tab.active ?? false,
    windowId: tab.windowId ?? -1,
  }
}

function removePinned(tabIds: number | number[]) {
  const ids = Array.isArray(tabIds) ? tabIds : [tabIds]
  useTabStore.getState().removePinnedTabIds(ids)
}

export function useTabs() {
  const { setTabs, addClosedTab } = useTabStore()

  const fetchTabs = useCallback(async () => {
    if (!isExtensionApiAvailable()) return
    try {
      const tabs = await chrome.tabs.query({})
      setTabs(tabs.map(normalizeTab))
    } catch (err) {
      console.error('Failed to fetch tabs:', err)
    }
  }, [setTabs])

  const closeTab = useCallback(async (tabId: number) => {
    if (!isExtensionApiAvailable()) return
    const tabs = useTabStore.getState().tabs
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) addClosedTab(tab)
    removePinned(tabId)
    await chrome.tabs.remove(tabId)
  }, [addClosedTab])

  const closeTabs = useCallback(async (tabIds: number[]) => {
    if (!isExtensionApiAvailable()) return
    for (const id of tabIds) {
      const tab = useTabStore.getState().tabs.find((t) => t.id === id)
      if (tab) addClosedTab(tab)
    }
    removePinned(tabIds)
    await chrome.tabs.remove(tabIds)
  }, [addClosedTab])

  const closeAllTabs = useCallback(async () => {
    if (!isExtensionApiAvailable()) return
    const allTabs = useTabStore.getState().tabs
    for (const tab of allTabs) {
      addClosedTab(tab)
    }
    removePinned(allTabs.map((t) => t.id))
    await chrome.tabs.remove(allTabs.map((t) => t.id))
  }, [addClosedTab])

  const activateTab = useCallback(async (tabId: number) => {
    if (!isExtensionApiAvailable()) return
    await chrome.tabs.update(tabId, { active: true })
  }, [])

  useEffect(() => {
    fetchTabs()
    // Listen for tab changes
    if (isExtensionApiAvailable()) {
      chrome.tabs.onCreated.addListener(fetchTabs)
      chrome.tabs.onRemoved.addListener((tabId) => {
        removePinned(tabId)
        fetchTabs()
      })
      chrome.tabs.onUpdated.addListener(fetchTabs)
      return () => {
        chrome.tabs.onCreated.removeListener(fetchTabs)
        chrome.tabs.onRemoved.removeListener(fetchTabs)
        chrome.tabs.onUpdated.removeListener(fetchTabs)
      }
    }
  }, [fetchTabs])

  return { fetchTabs, closeTab, closeTabs, closeAllTabs, activateTab }
}
