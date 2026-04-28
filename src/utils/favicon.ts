const GOOGLE_FAVICON_API = 'https://www.google.com/s2/favicons'

export function getFaviconUrl(url: string, size: number = 32): string {
  try {
    const parsed = new URL(url)
    return `${GOOGLE_FAVICON_API}?domain=${parsed.hostname}&sz=${size}`
  } catch {
    return `${GOOGLE_FAVICON_API}?domain=example.com&sz=${size}`
  }
}

export function getDefaultFaviconUrl(size: number = 32): string {
  return `${GOOGLE_FAVICON_API}?domain=placeholder&sz=${size}`
}
