import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone } from 'lucide-react'
import { adminUserService } from '../../services/adminUserService'
import { extractErrorMessage } from '../../services/errorUtils'
import Alert from '../../components/ui/Alert'

export default function AdminCustomerDetailPage() {
  const { customerId } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    adminUserService
      .getCustomer(customerId)
      .then((data) => active && setCustomer(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [customerId])

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading customer…</p>
  if (error) return <Alert message={error} />
  if (!customer) return null

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/admin/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cocoa-soft hover:text-cocoa">
        <ArrowLeft size={15} />
        Back to customers
      </Link>

      <div className="rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="scallop-top" />
        <div className="px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-14 h-14 rounded-full bg-blush text-berry-dark overflow-hidden">
              {customer.avatarUrl ? (
                <img src={customer.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={24} />
              )}
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-cocoa">{customer.name}</h1>
              <p className="text-sm text-cocoa-soft">{customer.isActive ? 'Active' : 'Inactive'} account</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-cocoa-soft">
              <Mail size={14} />
              {customer.email}
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2 text-cocoa-soft">
                <Phone size={14} />
                {customer.phone}
              </div>
            )}
          </dl>

          <p className="mt-6 text-xs text-cocoa-soft">
            Joined {new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
