import { useSiteStore } from '@/modules/site-nav/siteStore'

describe('siteStore', () => {
  beforeEach(() => {
    useSiteStore.setState({
      sites: [],
      groups: [
        { id: 'work', name: '工作', order: 0 },
        { id: 'common', name: '常用', order: 1 },
      ],
      activeGroupId: 'all',
    })
  })

  it('adds a site', async () => {
    await useSiteStore.getState().addSite({
      title: 'Google',
      url: 'https://google.com',
      groupId: 'common',
      order: 0,
    })
    expect(useSiteStore.getState().sites).toHaveLength(1)
    expect(useSiteStore.getState().sites[0].title).toBe('Google')
  })

  it('deletes a site', async () => {
    await useSiteStore.getState().addSite({
      title: 'Test',
      url: 'https://test.com',
      groupId: 'work',
      order: 0,
    })
    const site = useSiteStore.getState().sites[0]
    await useSiteStore.getState().deleteSite(site.id)
    expect(useSiteStore.getState().sites).toHaveLength(0)
  })

  it('adds a group', async () => {
    await useSiteStore.getState().addGroup('娱乐')
    expect(useSiteStore.getState().groups).toHaveLength(3)
    expect(useSiteStore.getState().groups[2].name).toBe('娱乐')
  })

  it('filters by active group', () => {
    useSiteStore.getState().setActiveGroup('work')
    expect(useSiteStore.getState().activeGroupId).toBe('work')
  })
})
