import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-berry text-cream hover:bg-berry-dark disabled:bg-berry/50',
  secondary: 'bg-transparent text-cocoa border border-cocoa/20 hover:bg-cream-deep',
  ghost: 'bg-transparent text-cocoa-soft hover:text-cocoa hover:bg-cream-deep',
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
