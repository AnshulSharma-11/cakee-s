import { Cake } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 group">
      <span className="grid place-items-center w-9 h-9 rounded-full bg-berry text-cream border-2 border-dashed border-caramel group-hover:border-berry-dark transition-colors">
        <Cake size={18} />
      </span>
      <span className="font-display text-xl font-semibold text-cocoa tracking-tight">
        CakeShop
      </span>
    </Link>
  )
}
