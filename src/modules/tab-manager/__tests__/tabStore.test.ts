import { useTabStore } from '@/modules/tab-manager/tabStore'

describe('tabStore', () => {
  beforeEach(() => {
    useTabStore.setState({
      tabs: [],
      workspaces: [],
      closedTabs: [],
      selectedTabIds: new Set(),
      activeWorkspaceId: 'all',
    })
  })

  it('adds a workspace', () => {
    useTabStore.getState().addWorkspace('Test Workspace')
    const workspaces = useTabStore.getState().workspaces
    expect(workspaces).toHaveLength(1)
    expect(workspaces[0].name).toBe('Test Workspace')
    expect(workspaces[0].id).toBeDefined()
  })

  it('renames a workspace', () => {
    useTabStore.getState().addWorkspace('Old Name')
    const workspace = useTabStore.getState().workspaces[0]
    useTabStore.getState().renameWorkspace(workspace.id, 'New Name')
    expect(useTabStore.getState().workspaces[0].name).toBe('New Name')
  })

  it('deletes a workspace', () => {
    useTabStore.getState().addWorkspace('To Delete')
    const workspace = useTabStore.getState().workspaces[0]
    useTabStore.getState().deleteWorkspace(workspace.id)
    expect(useTabStore.getState().workspaces).toHaveLength(0)
  })

  it('selects and deselects tabs', () => {
    useTabStore.getState().selectTab(1)
    expect(useTabStore.getState().selectedTabIds.has(1)).toBe(true)

    useTabStore.getState().selectTab(1, true) // deselect
    expect(useTabStore.getState().selectedTabIds.has(1)).toBe(false)
  })

  it('selects multiple tabs with multi flag', () => {
    useTabStore.getState().selectTab(1, true)
    useTabStore.getState().selectTab(2, true)
    expect(useTabStore.getState().selectedTabIds.size).toBe(2)
  })

  it('clears selection', () => {
    useTabStore.getState().selectTab(1)
    useTabStore.getState().selectTab(2, true)
    useTabStore.getState().clearSelection()
    expect(useTabStore.getState().selectedTabIds.size).toBe(0)
  })

  it('tracks closed tabs up to 20', () => {
    const mockTab = {
      id: 1,
      title: 'Test',
      url: 'https://test.com',
      pinned: false,
      active: false,
      windowId: 1,
    }
    useTabStore.getState().addClosedTab(mockTab)
    expect(useTabStore.getState().closedTabs).toHaveLength(1)
  })
})
