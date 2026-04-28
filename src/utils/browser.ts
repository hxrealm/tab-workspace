export type BrowserType = 'chrome' | 'edge' | 'safari' | 'firefox' | 'unknown'

export function detectBrowser(): BrowserType {
  const ua = navigator.userAgent
  if (ua.includes('Edg/')) return 'edge'
  if (ua.includes('Chrome/')) return 'chrome'
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'safari'
  if (ua.includes('Firefox/')) return 'firefox'
  return 'unknown'
}

export function isExtensionApiAvailable(): boolean {
  return typeof chrome !== 'undefined' && chrome.tabs !== undefined
}

export function getBrowserUnsupportedMessage(browser: BrowserType): string | null {
  if (browser === 'safari') {
    return 'Safari 模式下部分功能可能需要手动启用，请查看设置页面了解更多。'
  }
  return null
}
