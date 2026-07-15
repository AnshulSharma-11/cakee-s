import { Link } from 'react-router-dom'
import { CakeSlice } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <CakeSlice size={40} className="mx-auto mb-4 text-caramel" />
      <h1 className="font-display text-2xl font-semibold text-cocoa">Page not found</h1>
      <p className="mt-2 text-cocoa-soft">This slice isn't on the menu.</p>
      <Link to="/" className="mt-6 inline-block font-semibold text-berry hover:text-berry-dark">
        Back to home
      </Link>
    </div>
  )
}
