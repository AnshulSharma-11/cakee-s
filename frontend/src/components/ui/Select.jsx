import { ChevronDown } from 'lucide-react'

export default function Select({ label, className = '', children, id, name, ...props }) {
  const selectId = id || name

  return (
    <label className="block" htmlFor={selectId}>
      {label && <span className="mb-1.5 block text-sm font-medium text-cocoa-soft">{label}</span>}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          className={`w-full appearance-none rounded-xl border border-blush bg-card px-4 py-2.5 pr-9 text-cocoa outline-none transition-colors focus:border-berry focus:ring-2 focus:ring-berry/40 ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cocoa-soft" />
      </div>
    </label>
  )
}
