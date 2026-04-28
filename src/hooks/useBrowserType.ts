import { useMemo } from 'react'
import { detectBrowser, isExtensionApiAvailable } from '@/utils/browser'

export function useBrowserType() {
  return useMemo(() => {
    const browser = detectBrowser()
    const apiAvailable = isExtensionApiAvailable()
    return { browser, apiAvailable }
  }, [])
}
