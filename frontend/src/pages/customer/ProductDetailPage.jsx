import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImageOff, ShoppingCart, Store } from 'lucide-react'
import { customerProductService } from '../../services/customerProductService'
import { cartService } from '../../services/cartService'
import { extractErrorMessage } from '../../services/errorUtils'
import { useCart } from '../../context/CartContext'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

const emptyCustomization = {
  weightKg: '',
  flavor: '',
  shape: '',
  messageOnCake: '',
  layers: '',
  specialNotes: '',
}

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { refreshCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adding, setAdding] = useState(false)

  const [customize, setCustomize] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [form, setForm] = useState(emptyCustomization)

  useEffect(() => {
    let active = true
    customerProductService
      .getOne(productId)
      .then((data) => active && setProduct(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [productId])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleAddToCart = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setAdding(true)
    try {
      const customization = customize
        ? {
            weightKg: form.weightKg ? Number(form.weightKg) : null,
            flavor: form.flavor || null,
            shape: form.shape || null,
            messageOnCake: form.messageOnCake || null,
            layers: form.layers ? Number(form.layers) : null,
            specialNotes: form.specialNotes || null,
          }
        : null

      await cartService.addItem({ productId: Number(productId), quantity: Number(quantity), customization })
      await refreshCart()
      setSuccess('Added to cart.')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading cake…</p>
  if (error && !product) return <Alert message={error} />
  if (!product) return null

  return (
    <div>
      <Link to="/customer/catalog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cocoa-soft hover:text-cocoa">
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
          <p className="text-xs text-cocoa-soft">{product.categoryName} • {product.subcategoryName}</p>
          <h1 className="font-display text-3xl font-semibold text-cocoa mt-1">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-berry-dark">₹{Number(product.basePrice).toFixed(2)}</p>

          {product.description && <p className="mt-4 text-cocoa-soft">{product.description}</p>}

          <Link
            to={`/customer/vendors/${product.vendorId}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-berry hover:text-berry-dark"
          >
            <Store size={14} />
            Sold by {product.vendorShopName}
          </Link>

          <div className="mt-6 rounded-2xl bg-card p-6 shadow-sm">
            <Alert type="error" message={error} />
            <Alert type="success" message={success} />

            <form onSubmit={handleAddToCart} className="space-y-4">
              <Input
                label="Quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-28"
              />

              <label className="flex items-center gap-2 text-sm font-medium text-cocoa cursor-pointer">
                <input
                  type="checkbox"
                  checked={customize}
                  onChange={(e) => setCustomize(e.target.checked)}
                  className="rounded border-blush text-berry focus:ring-berry"
                />
                Customize this cake
              </label>

              {customize && (
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-cream-deep/50 p-4">
                  <Input label="Weight (kg)" name="weightKg" type="number" step="0.1" min="0" value={form.weightKg} onChange={handleChange} />
                  <Input label="Layers" name="layers" type="number" min="1" value={form.layers} onChange={handleChange} />
                  <Input label="Flavor" name="flavor" value={form.flavor} onChange={handleChange} placeholder="e.g. Chocolate" />
                  <Select label="Shape" name="shape" value={form.shape} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Round">Round</option>
                    <option value="Square">Square</option>
                    <option value="Heart">Heart</option>
                    <option value="Tiered">Tiered</option>
                  </Select>
                  <div className="col-span-2">
                    <Input
                      label="Message on cake"
                      name="messageOnCake"
                      value={form.messageOnCake}
                      onChange={handleChange}
                      placeholder="e.g. Happy Birthday Aria!"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-cocoa-soft">Special notes</span>
                      <textarea
                        name="specialNotes"
                        rows={2}
                        value={form.specialNotes}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-blush bg-card px-4 py-2.5 text-cocoa outline-none focus:border-berry focus:ring-2 focus:ring-berry/40"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="submit" loading={adding} className="flex-1">
                  <ShoppingCart size={16} />
                  Add to cart
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/customer/cart')}>
                  View cart
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
