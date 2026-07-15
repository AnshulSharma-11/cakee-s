import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ImageOff, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { cartService } from '../../services/cartService'
import { extractErrorMessage } from '../../services/errorUtils'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function CartPage() {
  const { cart, loading, refreshCart } = useCart()
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [busyItemId, setBusyItemId] = useState(null)
  const [removeTarget, setRemoveTarget] = useState(null)
  const [removing, setRemoving] = useState(false)

  const changeQuantity = async (item, delta) => {
    const next = item.quantity + delta
    if (next < 1) return
    setBusyItemId(item.id)
    setError('')
    try {
      await cartService.updateItem(item.id, { quantity: next })
      await refreshCart()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setBusyItemId(null)
    }
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    setRemoving(true)
    try {
      await cartService.removeItem(removeTarget.id)
      await refreshCart()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setRemoving(false)
      setRemoveTarget(null)
    }
  }

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading your cart…</p>

  if (cart.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <ShoppingBag size={36} className="mx-auto mb-3 text-caramel" />
        <h1 className="font-display text-xl font-semibold text-cocoa">Your cart is empty</h1>
        <p className="mt-1 text-cocoa-soft">Time to find a cake worth celebrating.</p>
        <Link to="/customer/catalog">
          <Button className="mt-5">Browse cakes</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-cocoa mb-6">Your cart</h1>

      <Alert message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl bg-card p-4 shadow-sm">
              <div className="w-20 h-20 shrink-0 rounded-xl bg-blush-soft grid place-items-center overflow-hidden">
                {item.productImageUrl ? (
                  <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={20} className="text-cocoa-soft" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-cocoa">{item.productName}</h3>
                <p className="text-sm text-cocoa-soft">₹{Number(item.unitPrice).toFixed(2)} each</p>

                {item.customization && (
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-cocoa-soft">
                    {item.customization.weightKg && <span className="rounded-full bg-cream-deep px-2 py-0.5">{item.customization.weightKg}kg</span>}
                    {item.customization.flavor && <span className="rounded-full bg-cream-deep px-2 py-0.5">{item.customization.flavor}</span>}
                    {item.customization.shape && <span className="rounded-full bg-cream-deep px-2 py-0.5">{item.customization.shape}</span>}
                    {item.customization.messageOnCake && (
                      <span className="rounded-full bg-cream-deep px-2 py-0.5">"{item.customization.messageOnCake}"</span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-blush px-1.5 py-1">
                    <button
                      onClick={() => changeQuantity(item, -1)}
                      disabled={busyItemId === item.id || item.quantity <= 1}
                      className="grid place-items-center w-6 h-6 rounded-full text-cocoa-soft hover:bg-cream-deep disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-sm font-medium text-cocoa">{item.quantity}</span>
                    <button
                      onClick={() => changeQuantity(item, 1)}
                      disabled={busyItemId === item.id}
                      className="grid place-items-center w-6 h-6 rounded-full text-cocoa-soft hover:bg-cream-deep"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => setRemoveTarget(item)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-berry-dark hover:text-berry"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right font-semibold text-cocoa">₹{Number(item.subtotal).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm h-fit">
          <h2 className="font-display text-lg font-semibold text-cocoa mb-4">Order summary</h2>
          <div className="flex justify-between text-sm text-cocoa-soft mb-2">
            <span>Items</span>
            <span>{cart.items.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-cocoa border-t border-blush pt-3 mt-3">
            <span>Total</span>
            <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
          </div>
          <Button className="w-full mt-5" onClick={() => navigate('/customer/checkout')}>
            Checkout
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        title="Remove this item?"
        message={removeTarget ? `"${removeTarget.productName}" will be removed from your cart.` : ''}
        loading={removing}
        onConfirm={handleRemove}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  )
}
