import { renderHook } from '@testing-library/react'
import { useTabs } from '@/modules/tab-manager/useTabs'

describe('useTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides closeTab function', () => {
    const { result } = renderHook(() => useTabs())
    expect(typeof result.current.closeTab).toBe('function')
    expect(typeof result.current.closeTabs).toBe('function')
    expect(typeof result.current.activateTab).toBe('function')
    expect(typeof result.current.fetchTabs).toBe('function')
  })
})
