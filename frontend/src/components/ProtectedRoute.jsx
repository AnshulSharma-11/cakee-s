import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Guards a route subtree. If `roles` is provided, only those roles may pass;
 * others are redirected to their own home instead of seeing a dead end.
 */
export default function ProtectedRoute({ roles }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return <Outlet />
}

export function homeForRole(role) {
  if (role === 'VENDOR') return '/vendor'
  if (role === 'CUSTOMER') return '/customer'
  if (role === 'ADMIN') return '/admin'
  return '/'
}
