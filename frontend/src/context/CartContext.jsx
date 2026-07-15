import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { cartService } from '../services/cartService'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 })
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(() => {
    return cartService
      .getCart()
      .then(setCart)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshCart().finally(() => setLoading(false))
  }, [refreshCart])

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
