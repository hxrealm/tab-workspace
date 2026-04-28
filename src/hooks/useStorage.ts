import { useCallback } from 'react'
import { getFromStorage, saveToStorage, removeFromStorage } from '@/utils/storage'

export function useStorage<T>(key: string, defaultValue: T) {
  const getValue = useCallback(async () => {
    return getFromStorage(key, defaultValue)
  }, [key, defaultValue])

  const setValue = useCallback(async (value: T) => {
    await saveToStorage(key, value)
  }, [key])

  const removeValue = useCallback(async () => {
    await removeFromStorage(key)
  }, [key])

  return { getValue, setValue, removeValue }
}
