import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Alert({ type = 'error', message }) {
  if (!message) return null

  const isError = type === 'error'
  return (
    <div
      className={`mb-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
        isError ? 'bg-berry/10 text-berry-dark' : 'bg-sage/15 text-sage'
      }`}
    >
      {isError ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
      <span>{message}</span>
    </div>
  )
}
