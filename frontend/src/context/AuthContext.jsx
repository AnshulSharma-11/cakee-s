import { createContext, useContext, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { setToken, clearToken } from '../services/tokenStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { userId, name, email, role }

  const applyAuthResponse = (res) => {
    setToken(res.token)
    setUser({ userId: res.userId, name: res.name, email: res.email, role: res.role })
  }

  const login = async (email, password) => {
    const res = await authService.login({ email, password })
    applyAuthResponse(res)
    return res
  }

  const registerVendor = async (payload) => {
    const res = await authService.registerVendor(payload)
    applyAuthResponse(res)
    return res
  }

  const registerCustomer = async (payload) => {
    const res = await authService.registerCustomer(payload)
    applyAuthResponse(res)
    return res
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearToken()
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      registerVendor,
      registerCustomer,
      logout,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
