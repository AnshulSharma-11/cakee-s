import { NavLink, Outlet } from 'react-router-dom'
import { Package, Tags, User } from 'lucide-react'

const tabs = [
  { to: '/vendor/products', label: 'Products', icon: Package },
  { to: '/vendor/categories', label: 'Categories', icon: Tags },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function VendorLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <nav className="mb-8 flex gap-1 rounded-full bg-card p-1 w-fit shadow-sm">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive ? 'bg-berry text-cream' : 'text-cocoa-soft hover:text-cocoa'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
