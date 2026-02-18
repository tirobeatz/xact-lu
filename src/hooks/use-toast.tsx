"use client"

import * as React from "react"

type ToastActionElement = React.ReactElement<any>
type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "success" | "error" | "warning"
}

type Toast = ToastProps & {
  id: string
  open: boolean
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastContextType = {
  toasts: Toast[]
  toast: (props: Omit<ToastProps, "id" | "open">) => {
    id: string
    dismiss: () => void
  }
  dismiss: (toastId?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((state) =>
        state.map((toast) =>
          toast.id === toastId ? { ...toast, open: false } : toast
        )
      )
      setTimeout(() => {
        setToasts((state) => state.filter((toast) => toast.id !== toastId))
      }, TOAST_REMOVE_DELAY)
    } else {
      setToasts((state) =>
        state.map((toast) => ({ ...toast, open: false }))
      )
      setTimeout(() => {
        setToasts([])
      }, TOAST_REMOVE_DELAY)
    }
  }, [])

  const toast = React.useCallback(
    (props: Omit<ToastProps, "id" | "open">) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: Toast = {
        ...props,
        id,
        open: true,
      }

      setToasts((state) => [newToast, ...state].slice(0, TOAST_LIMIT))

      setTimeout(() => {
        dismiss(id)
      }, 5000)

      return {
        id,
        dismiss: () => dismiss(id),
      }
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}
