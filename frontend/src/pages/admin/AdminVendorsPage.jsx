import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Store, ChevronRight } from 'lucide-react'
import { adminUserService } from '../../services/adminUserService'
import { extractErrorMessage } from '../../services/errorUtils'
import Alert from '../../components/ui/Alert'

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    adminUserService
      .listVendors()
      .then((data) => active && setVendors(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading vendors…</p>

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-cocoa">Vendors</h1>
        <p className="text-sm text-cocoa-soft">{vendors.length} shop{vendors.length !== 1 ? 's' : ''} on the platform.</p>
      </div>

      <Alert message={error} />

      <div className="space-y-2">
        {vendors.map((v) => (
          <Link
            key={v.vendorProfileId}
            to={`/admin/vendors/${v.vendorProfileId}`}
            className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-blush text-berry-dark">
                <Store size={18} />
              </span>
              <div>
                <p className="font-medium text-cocoa">{v.shopName}</p>
                <p className="text-sm text-cocoa-soft">
                  {v.name} • {v.email}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-cocoa-soft" />
          </Link>
        ))}
        {vendors.length === 0 && <p className="py-8 text-center text-cocoa-soft">No vendors yet.</p>}
      </div>
    </div>
  )
}
