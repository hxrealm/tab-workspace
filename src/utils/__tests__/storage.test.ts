import { saveToStorage, getFromStorage } from '@/utils/storage'

describe('storage utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('saveToStorage / getFromStorage', () => {
    it('saves and retrieves data from chrome.storage.sync', async () => {
      vi.mocked(chrome.storage.sync.get).mockResolvedValueOnce({
        testKey: 'testValue',
      })

      const result = await getFromStorage('testKey', 'default')
      expect(result).toBe('testValue')
    })

    it('returns default value when key not found', async () => {
      vi.mocked(chrome.storage.sync.get).mockResolvedValueOnce({})

      const result = await getFromStorage('missing', 'fallback')
      expect(result).toBe('fallback')
    })

    it('saves data to chrome.storage.sync', async () => {
      await saveToStorage('myKey', { foo: 'bar' })
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        myKey: { foo: 'bar' },
      })
    })
  })

  describe('localStorage fallback', () => {
    it('falls back to localStorage when chrome API fails', async () => {
      vi.mocked(chrome.storage.sync.get).mockRejectedValueOnce(new Error('API unavailable'))
      localStorage.setItem('testKey', '"localValue"')

      const result = await getFromStorage('testKey', 'default')
      expect(result).toBe('localValue')
    })
  })
})
