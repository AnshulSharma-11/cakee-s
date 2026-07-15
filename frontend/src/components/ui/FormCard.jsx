export default function FormCard({ children, className = '' }) {
  return (
    <div className={`w-full max-w-md rounded-2xl bg-card shadow-[0_20px_50px_-20px_rgba(74,59,53,0.25)] overflow-hidden ${className}`}>
      <div className="scallop-top" />
      <div className="px-8 py-8">{children}</div>
    </div>
  )
}
