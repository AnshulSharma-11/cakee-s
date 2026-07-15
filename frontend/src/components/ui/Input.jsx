export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name

  return (
    <label className="block" htmlFor={inputId}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-cocoa-soft">{label}</span>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-card px-4 py-2.5 text-cocoa placeholder:text-cocoa-soft/50 outline-none transition-colors focus:ring-2 focus:ring-berry/40 ${
          error ? 'border-berry-dark' : 'border-blush focus:border-berry'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-berry-dark">{error}</span>}
    </label>
  )
}
