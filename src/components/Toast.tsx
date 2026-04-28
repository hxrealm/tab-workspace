import { create } from 'zustand'

interface ToastData {
  message: string
  type: 'info' | 'success' | 'error'
  id: number
}

interface ToastState {
  toasts: ToastData[]
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void
  removeToast: (id: number) => void
}

let toastId = 0
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type = 'info') => {
    const id = ++toastId
    set((state) => ({ toasts: [...state.toasts, { message, type, id }] }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 3000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-4 py-2 rounded-lg text-sm text-white shadow-md cursor-pointer animate-fade-in"
          style={{
            background:
              toast.type === 'error'
                ? '#e74c3c'
                : toast.type === 'success'
                ? '#27ae60'
                : 'var(--color-text)',
          }}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
