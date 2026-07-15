import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 0}
        className="grid place-items-center w-9 h-9 rounded-full border border-blush text-cocoa-soft hover:text-cocoa hover:border-berry disabled:opacity-30 disabled:hover:border-blush"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-cocoa-soft">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="grid place-items-center w-9 h-9 rounded-full border border-blush text-cocoa-soft hover:text-cocoa hover:border-berry disabled:opacity-30 disabled:hover:border-blush"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
