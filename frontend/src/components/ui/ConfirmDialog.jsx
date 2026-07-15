import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa/40 px-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 grid place-items-center w-11 h-11 rounded-full bg-berry/10 text-berry-dark">
          <AlertTriangle size={20} />
        </div>
        <h2 className="font-display text-lg font-semibold text-cocoa">{title}</h2>
        <p className="mt-1.5 text-sm text-cocoa-soft">{message}</p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
