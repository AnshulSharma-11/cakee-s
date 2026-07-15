import { Link } from 'react-router-dom'
import { Cake, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <span className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full bg-blush text-berry-dark">
        <Cake size={28} />
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-cocoa leading-tight">
        Custom cakes,
        <br />
        baked by hand.
      </h1>
      <p className="mt-4 text-cocoa-soft max-w-md mx-auto">
        Order a cake exactly the way you want it, or open your own stall and start selling.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link to="/register">
          <Button>
            <Sparkles size={16} />
            Get started
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary">Log in</Button>
        </Link>
      </div>
    </div>
  )
}
