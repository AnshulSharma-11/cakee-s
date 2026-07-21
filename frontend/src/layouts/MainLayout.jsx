import { useEffect, useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, User, LayoutGrid, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { homeForRole } from '../components/ProtectedRoute'
import Logo from '../components/ui/Logo'
import Button from '../components/ui/Button'

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className={`sticky top-0 z-30 glass-nav transition-colors ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Logo to={isAuthenticated ? homeForRole(user.role) : '/'} />

          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-blush text-berry-dark' : 'text-cocoa-soft hover:text-cocoa hover:bg-cream-deep'
                }`
              }
            >
              <Search size={15} />
              Browse cakes
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={homeForRole(user.role)}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-cocoa-soft hover:text-cocoa"
                >
                  <LayoutGrid size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-cocoa-soft hover:text-cocoa"
                >
                  <User size={16} />
                  {user.name}
                </Link>
                <Button variant="secondary" onClick={handleLogout} className="bg-cream/60 backdrop-blur">
                  <LogOut size={15} />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-cocoa-soft hover:text-cocoa">
                  Log in
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-blush">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-5 text-sm text-cocoa-soft">
            <Link to="/products" className="hover:text-cocoa">Browse cakes</Link>
            <Link to="/register" className="hover:text-cocoa">Sell on CakeShop</Link>
          </div>
          <p className="text-sm text-cocoa-soft">© {new Date().getFullYear()} CakeShop — baked with care</p>
        </div>
      </footer>
    </div>
  )
}
