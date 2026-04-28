import { getFaviconUrl, getDefaultFaviconUrl } from '@/utils/favicon'

describe('getFaviconUrl', () => {
  it('returns google favicon URL for valid URL', () => {
    const result = getFaviconUrl('https://github.com/some/repo')
    expect(result).toContain('google.com/s2/favicons')
    expect(result).toContain('domain=github.com')
  })

  it('uses default size of 32 when not specified', () => {
    const result = getFaviconUrl('https://example.com')
    expect(result).toContain('sz=32')
  })

  it('uses custom size when specified', () => {
    const result = getFaviconUrl('https://example.com', 64)
    expect(result).toContain('sz=64')
  })

  it('handles invalid URLs gracefully', () => {
    const result = getFaviconUrl('not-a-valid-url')
    expect(result).toContain('domain=example.com')
  })
})

describe('getDefaultFaviconUrl', () => {
  it('returns placeholder favicon URL', () => {
    const result = getDefaultFaviconUrl()
    expect(result).toContain('domain=placeholder')
  })
})
