import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ImageOff, LogIn, Sparkles, Store } from 'lucide-react'
import { publicProductService } from '../../services/publicProductService'
import { extractErrorMessage } from '../../services/errorUtils'
import { useAuth } from '../../context/AuthContext'
import { homeForRole } from '../../components/ProtectedRoute'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

export default function PublicProductDetailPage() {
  const { productId } = useParams()
  const { isAuthenticated, user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    publicProductService
      .getOne(productId)
      .then((data) => active && setProduct(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [productId])

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading cake…</p>
  if (error && !product) return <div className="mx-auto max-w-2xl px-6 py-16"><Alert message={error} /></div>
  if (!product) return null

  // Where "order this cake" should send someone. A logged-in customer goes
  // straight to the authenticated product page; a vendor/admin (or a guest)
  // lands on /login, which then routes them appropriately.
  const orderTarget = isAuthenticated && user?.role === 'CUSTOMER' ? `/customer/products/${product.id}` : '/login'
  const loginState = { from: { pathname: `/customer/products/${product.id}` } }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Link to="/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cocoa-soft hover:text-cocoa">
        <ArrowLeft size={15} />
        Back to catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square rounded-2xl bg-blush-soft grid place-items-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ImageOff size={40} className="text-cocoa-soft" />
          )}
        </div>

        <div>
          <p className="text-xs text-cocoa-soft">
            {product.categoryName} • {product.subcategoryName}
          </p>
          <h1 className="font-display text-3xl font-semibold text-cocoa mt-1">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-berry-dark">₹{Number(product.basePrice).toFixed(2)}</p>

          {product.description && <p className="mt-4 text-cocoa-soft">{product.description}</p>}

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-berry">
            <Store size={14} />
            Sold by {product.vendorShopName}
          </span>

          <div className="mt-6 rounded-2xl bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-cocoa">Ready to order?</h2>
            <p className="mt-1 text-sm text-cocoa-soft">
              {isAuthenticated && user?.role === 'CUSTOMER'
                ? 'Add it to your cart, customize the size, flavor and message on the way.'
                : 'Log in or create a free account to customize and order this cake.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={orderTarget} state={isAuthenticated ? undefined : loginState}>
                <Button>
                  {isAuthenticated && user?.role === 'CUSTOMER' ? (
                    <>
                      <Sparkles size={16} />
                      Customize &amp; add to cart
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      Log in to order
                    </>
                  )}
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register" state={loginState}>
                  <Button variant="secondary">Create an account</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
