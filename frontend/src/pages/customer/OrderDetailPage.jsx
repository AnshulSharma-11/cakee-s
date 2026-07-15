import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, CalendarDays, PartyPopper } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { extractErrorMessage } from '../../services/errorUtils'
import Alert from '../../components/ui/Alert'
import StatusBadge from '../../components/ui/StatusBadge'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const location = useLocation()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    orderService
      .getOne(orderId)
      .then((data) => active && setOrder(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [orderId])

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading order…</p>
  if (error) return <Alert message={error} />
  if (!order) return null

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/customer/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cocoa-soft hover:text-cocoa">
        <ArrowLeft size={15} />
        Back to orders
      </Link>

      {location.state?.justPlaced && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-sage/15 px-4 py-3 text-sm text-sage">
          <PartyPopper size={16} />
          Order placed! We'll get your cake baking.
        </div>
      )}

      <div className="rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="scallop-top" />
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-semibold text-cocoa">Order #{order.id}</h1>
              <p className="text-sm text-cocoa-soft">
                Placed {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="space-y-3 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between rounded-xl bg-cream-deep/50 p-4">
                <div>
                  <p className="font-medium text-cocoa">
                    {item.productName} × {item.quantity}
                  </p>
                  <p className="text-xs text-cocoa-soft">from {item.vendorShopName}</p>
                  {item.customization && (
                    <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-cocoa-soft">
                      {item.customization.weightKg && <span className="rounded-full bg-card px-2 py-0.5">{item.customization.weightKg}kg</span>}
                      {item.customization.flavor && <span className="rounded-full bg-card px-2 py-0.5">{item.customization.flavor}</span>}
                      {item.customization.shape && <span className="rounded-full bg-card px-2 py-0.5">{item.customization.shape}</span>}
                      {item.customization.messageOnCake && (
                        <span className="rounded-full bg-card px-2 py-0.5">"{item.customization.messageOnCake}"</span>
                      )}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-cocoa">₹{Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-base font-semibold text-cocoa border-t border-blush pt-4 mb-6">
            <span>Total</span>
            <span>₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>

          {order.delivery && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2 rounded-xl bg-cream-deep/50 p-4 text-sm">
                <MapPin size={16} className="mt-0.5 text-berry-dark shrink-0" />
                <div>
                  <p className="font-medium text-cocoa">Delivery address</p>
                  <p className="text-cocoa-soft">{order.delivery.addressSummary}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-cream-deep/50 p-4 text-sm">
                <CalendarDays size={16} className="mt-0.5 text-berry-dark shrink-0" />
                <div>
                  <p className="font-medium text-cocoa">Delivery date</p>
                  <p className="text-cocoa-soft">{order.delivery.deliveryDate}</p>
                  <StatusBadge status={order.delivery.status} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
