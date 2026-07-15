import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, ShoppingCart, ReceiptText, User } from 'lucide-react'
import { CartProvider, useCart } from '../context/CartContext'

const tabs = [
  { to: '/customer/catalog', label: 'Browse', icon: LayoutGrid },
  { to: '/customer/cart', label: 'Cart', icon: ShoppingCart, badge: true },
  { to: '/customer/orders', label: 'My orders', icon: ReceiptText },
  { to: '/profile', label: 'Profile', icon: User },
]

function CustomerNav() {
  const { itemCount } = useCart()

  return (
    <nav className="mb-8 flex gap-1 rounded-full bg-card p-1 w-fit shadow-sm">
      {tabs.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? 'bg-berry text-cream' : 'text-cocoa-soft hover:text-cocoa'
            }`
          }
        >
          <Icon size={15} />
          {label}
          {badge && itemCount > 0 && (
            <span className="grid place-items-center min-w-[18px] h-[18px] rounded-full bg-caramel px-1 text-[10px] font-bold text-cocoa">
              {itemCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function CustomerLayout() {
  return (
    <CartProvider>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <CustomerNav />
        <Outlet />
      </div>
    </CartProvider>
  )
}
