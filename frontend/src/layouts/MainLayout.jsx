import { Outlet, Link, useNavigate } from 'react-router-dom'
import { LogOut, User, LayoutGrid } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { homeForRole } from '../components/ProtectedRoute'
import Logo from '../components/ui/Logo'
import Button from '../components/ui/Button'

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="bg-card">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo to={isAuthenticated ? homeForRole(user.role) : '/'} />

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
                <Button variant="secondary" onClick={handleLogout}>
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
        <div className="scallop-bottom" />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-blush px-6 py-6 text-center text-sm text-cocoa-soft">
        © {new Date().getFullYear()} CakeShop — baked with care
      </footer>
    </div>
  )
}
