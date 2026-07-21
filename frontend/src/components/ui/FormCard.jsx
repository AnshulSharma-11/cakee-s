export default function FormCard({ children, className = '' }) {
  return (
    <div className={`w-full max-w-md rounded-2xl glass overflow-hidden ${className}`}>
      <div className="scallop-top" style={{ '--scallop-color': 'rgba(255,253,249,0.75)' }} />
      <div className="px-8 py-8">{children}</div>
    </div>
  )
}
