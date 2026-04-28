import { create } from 'zustand'
import type { PhotoAlbum, Photo } from '@/types'
import { getFromStorage, saveToStorage } from '@/utils/storage'

const ALBUMS_KEY = 'ai-tab-albums'
const DB_NAME = 'ai-tab-photos'
const DB_VERSION = 1
const PHOTOS_STORE = 'photos'
const META_STORE = 'meta'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(PHOTOS_STORE)) {
        db.createObjectStore(PHOTOS_STORE, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function savePhotoToDB(photo: Photo): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTOS_STORE, 'readwrite')
    tx.objectStore(PHOTOS_STORE).put(photo)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function getAllPhotosFromDB(): Promise<Photo[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTOS_STORE, 'readonly')
    const request = tx.objectStore(PHOTOS_STORE).getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function deletePhotoFromDB(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTOS_STORE, 'readwrite')
    tx.objectStore(PHOTOS_STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

const defaultAlbums: PhotoAlbum[] = [
  { id: 'all', name: '', order: 0 },
  { id: 'travel', name: '', order: 1 },
  { id: 'work', name: '', order: 2 },
  { id: 'life', name: '', order: 3 },
]

const ALBUM_I18N_KEY: Record<string, string> = {
  all: 'photos.album.all',
  travel: 'photos.album.travel',
  work: 'photos.album.work',
  life: 'photos.album.life',
}

function getLocaleForAlbums(): string {
  const stored = localStorage.getItem('ai-tab-locale')
  if (stored && (stored === 'zh-CN' || stored === 'zh-TW' || stored === 'en')) return stored
  const nav = navigator.language || 'en'
  if (nav.startsWith('zh-TW') || nav.startsWith('zh-HK')) return 'zh-TW'
  if (nav.startsWith('zh')) return 'zh-CN'
  return 'en'
}

function localizeAlbums(albums: PhotoAlbum[]): PhotoAlbum[] {
  const locale = getLocaleForAlbums()
  return albums.map((a) => ({
    ...a,
    name: tAlbumKey(a.id, locale) || a.name,
  }))
}

function tAlbumKey(id: string, locale: string): string {
  const key = ALBUM_I18N_KEY[id]
  if (!key) return ''
  const map: Record<string, Record<string, string>> = {
    en: { 'photos.album.all': 'All', 'photos.album.travel': 'Travel', 'photos.album.work': 'Work', 'photos.album.life': 'Life' },
    'zh-CN': { 'photos.album.all': '全部', 'photos.album.travel': '旅行', 'photos.album.work': '工作', 'photos.album.life': '生活' },
    'zh-TW': { 'photos.album.all': '全部', 'photos.album.travel': '旅行', 'photos.album.work': '工作', 'photos.album.life': '生活' },
  }
  return map[locale]?.[key] || ''
}

interface PhotoState {
  albums: PhotoAlbum[]
  photos: Photo[]
  activeAlbumId: string
  previewPhoto: Photo | null

  loadPhotos: () => Promise<void>
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => Promise<void>
  deletePhoto: (id: string) => Promise<void>
  addAlbum: (name: string) => Promise<void>
  deleteAlbum: (id: string) => Promise<void>
  setActiveAlbum: (id: string) => void
  setPreviewPhoto: (photo: Photo | null) => void
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  albums: defaultAlbums,
  photos: [],
  activeAlbumId: 'all',
  previewPhoto: null,

  loadPhotos: async () => {
    try {
      // Load albums from chrome.storage/localStorage
      const rawAlbums = await getFromStorage<PhotoAlbum[]>(ALBUMS_KEY, defaultAlbums)
      // Localize album names
      const albums = localizeAlbums(rawAlbums)
      // Load photos from IndexedDB (the authoritative source)
      const photos = await getAllPhotosFromDB()
      set({ albums, photos })
    } catch (err) {
      console.error('Failed to load photos:', err)
    }
  },

  addPhoto: async (photo) => {
    const newPhoto: Photo = {
      ...photo,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    await savePhotoToDB(newPhoto)
    set((state) => ({
      photos: [...state.photos, newPhoto],
    }))
  },

  deletePhoto: async (id) => {
    await deletePhotoFromDB(id)
    set((state) => ({
      photos: state.photos.filter((p) => p.id !== id),
    }))
  },

  addAlbum: async (name) => {
    const newAlbum: PhotoAlbum = {
      id: crypto.randomUUID(),
      name,
      order: get().albums.length,
    }
    set((state) => {
      const updated = [...state.albums, newAlbum]
      saveToStorage(ALBUMS_KEY, updated)
      return { albums: updated }
    })
  },

  deleteAlbum: async (id) => {
    set((state) => {
      const updated = state.albums.filter((a) => a.id !== id && a.id !== 'all')
      saveToStorage(ALBUMS_KEY, updated)
      return { albums: updated }
    })
  },

  setActiveAlbum: (id) => set({ activeAlbumId: id }),
  setPreviewPhoto: (photo) => set({ previewPhoto: photo }),
}))
