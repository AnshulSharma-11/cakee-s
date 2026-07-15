import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, CalendarDays, CheckCircle2 } from 'lucide-react'
import { addressService } from '../../services/addressService'
import { orderService } from '../../services/orderService'
import { extractErrorMessage } from '../../services/errorUtils'
import { useCart } from '../../context/CartContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

const emptyAddress = { line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false }

function tomorrowISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [deliveryDate, setDeliveryDate] = useState(tomorrowISO())

  const [showAddForm, setShowAddForm] = useState(false)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [savingAddress, setSavingAddress] = useState(false)

  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  const loadAddresses = () =>
    addressService
      .list()
      .then((data) => {
        setAddresses(data)
        const def = data.find((a) => a.isDefault) || data[0]
        if (def) setSelectedAddressId(String(def.id))
        setShowAddForm(data.length === 0)
      })
      .catch((err) => setError(extractErrorMessage(err)))

  useEffect(() => {
    loadAddresses().finally(() => setLoadingAddresses(false))
  }, [])

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const submitAddress = async (e) => {
    e.preventDefault()
    setSavingAddress(true)
    setError('')
    try {
      const created = await addressService.create(addressForm)
      await loadAddresses()
      setSelectedAddressId(String(created.id))
      setAddressForm(emptyAddress)
      setShowAddForm(false)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSavingAddress(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !deliveryDate) return
    setError('')
    setPlacing(true)
    try {
      const order = await orderService.placeOrder({
        addressId: Number(selectedAddressId),
        deliveryDate,
      })
      await refreshCart()
      navigate(`/customer/orders/${order.id}`, { state: { justPlaced: true } })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setPlacing(false)
    }
  }

  if (cart.items.length === 0) {
    return <p className="py-16 text-center text-cocoa-soft">Your cart is empty — nothing to check out yet.</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cocoa mb-1">Checkout</h1>
          <p className="text-sm text-cocoa-soft">Choose where and when your cake should arrive.</p>
        </div>

        <Alert message={error} />

        {/* Address selection */}
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-cocoa">
              <MapPin size={18} />
              <h2 className="font-display text-lg font-semibold">Delivery address</h2>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-berry hover:text-berry-dark"
              >
                <Plus size={14} />
                Add new
              </button>
            )}
          </div>

          {loadingAddresses ? (
            <p className="text-sm text-cocoa-soft">Loading addresses…</p>
          ) : (
            <div className="space-y-2 mb-4">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                    String(a.id) === selectedAddressId ? 'border-berry bg-berry/5' : 'border-blush hover:border-berry/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 text-berry focus:ring-berry"
                    checked={String(a.id) === selectedAddressId}
                    onChange={() => setSelectedAddressId(String(a.id))}
                  />
                  <div className="text-sm">
                    <p className="font-medium text-cocoa">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ''}
                    </p>
                    <p className="text-cocoa-soft">
                      {a.city}, {a.state} - {a.pincode}
                    </p>
                    {a.isDefault && <span className="text-xs font-semibold text-berry">Default</span>}
                  </div>
                </label>
              ))}
            </div>
          )}

          {showAddForm && (
            <form onSubmit={submitAddress} className="space-y-3 rounded-xl bg-cream-deep/50 p-4">
              <Input label="Address line 1" name="line1" value={addressForm.line1} onChange={handleAddressFormChange} required />
              <Input label="Address line 2" name="line2" value={addressForm.line2} onChange={handleAddressFormChange} placeholder="Optional" />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" name="city" value={addressForm.city} onChange={handleAddressFormChange} required />
                <Input label="State" name="state" value={addressForm.state} onChange={handleAddressFormChange} required />
                <Input label="Pincode" name="pincode" value={addressForm.pincode} onChange={handleAddressFormChange} required />
              </div>
              <label className="flex items-center gap-2 text-sm text-cocoa">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressFormChange}
                  className="rounded border-blush text-berry focus:ring-berry"
                />
                Set as default
              </label>
              <div className="flex justify-end gap-2 pt-1">
                {addresses.length > 0 && (
                  <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" loading={savingAddress}>
                  Save address
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Delivery date */}
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-cocoa">
            <CalendarDays size={18} />
            <h2 className="font-display text-lg font-semibold">Delivery date</h2>
          </div>
          <Input
            type="date"
            min={tomorrowISO()}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-card p-6 shadow-sm h-fit">
        <h2 className="font-display text-lg font-semibold text-cocoa mb-4">Order summary</h2>
        <ul className="space-y-2 mb-4 text-sm">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between text-cocoa-soft">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span className="text-cocoa">₹{Number(item.subtotal).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-base font-semibold text-cocoa border-t border-blush pt-3">
          <span>Total</span>
          <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
        </div>
        <Button
          className="w-full mt-5"
          onClick={handlePlaceOrder}
          loading={placing}
          disabled={!selectedAddressId || !deliveryDate}
        >
          <CheckCircle2 size={16} />
          Place order
        </Button>
      </div>
    </div>
  )
}
