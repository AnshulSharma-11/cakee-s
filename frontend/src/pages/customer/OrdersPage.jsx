import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ReceiptText, ChevronRight } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { extractErrorMessage } from '../../services/errorUtils'
import Alert from '../../components/ui/Alert'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    orderService
      .listMine()
      .then((data) => active && setOrders(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading your orders…</p>

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-cocoa mb-6">My orders</h1>

      <Alert message={error} />

      {orders.length === 0 ? (
        <div className="py-16 text-center">
          <ReceiptText size={36} className="mx-auto mb-3 text-caramel" />
          <h2 className="font-display text-xl font-semibold text-cocoa">No orders yet</h2>
          <p className="mt-1 text-cocoa-soft">Once you check out, your orders will show up here.</p>
          <Link to="/customer/catalog">
            <Button className="mt-5">Browse cakes</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/customer/orders/${o.id}`}
              className="flex items-center justify-between rounded-2xl bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-medium text-cocoa">Order #{o.id}</p>
                <p className="text-sm text-cocoa-soft">
                  {new Date(o.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} •{' '}
                  {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-cocoa">₹{Number(o.totalAmount).toFixed(2)}</span>
                <StatusBadge status={o.status} />
                <ChevronRight size={16} className="text-cocoa-soft" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
