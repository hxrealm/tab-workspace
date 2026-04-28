import { useUiStore } from '@/store/uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      currentModule: 'tabs',
      sidebarCollapsed: false,
    })
  })

  it('starts with tabs module', () => {
    expect(useUiStore.getState().currentModule).toBe('tabs')
  })

  it('changes current module', () => {
    useUiStore.getState().setModule('sites')
    expect(useUiStore.getState().currentModule).toBe('sites')
  })
})
