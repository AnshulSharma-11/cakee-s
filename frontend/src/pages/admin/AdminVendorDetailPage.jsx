import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Store, Mail, Phone, MapPin, User } from 'lucide-react'
import { adminUserService } from '../../services/adminUserService'
import { extractErrorMessage } from '../../services/errorUtils'
import Alert from '../../components/ui/Alert'

export default function AdminVendorDetailPage() {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    adminUserService
      .getVendor(vendorId)
      .then((data) => active && setVendor(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [vendorId])

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading vendor…</p>
  if (error) return <Alert message={error} />
  if (!vendor) return null

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/admin/vendors" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cocoa-soft hover:text-cocoa">
        <ArrowLeft size={15} />
        Back to vendors
      </Link>

      <div className="rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="scallop-top" />
        <div className="px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-14 h-14 rounded-full bg-blush text-berry-dark">
              <Store size={24} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-cocoa">{vendor.shopName}</h1>
              <p className="text-sm text-cocoa-soft">{vendor.isActive ? 'Active' : 'Inactive'} account</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-cocoa-soft">
              <User size={14} />
              <span className="font-medium text-cocoa">{vendor.name}</span>
              <span>(owner)</span>
            </div>
            <div className="flex items-center gap-2 text-cocoa-soft">
              <Mail size={14} />
              {vendor.email}
            </div>
            {vendor.phone && (
              <div className="flex items-center gap-2 text-cocoa-soft">
                <Phone size={14} />
                {vendor.phone}
              </div>
            )}
            {vendor.shopAddress && (
              <div className="flex items-center gap-2 text-cocoa-soft">
                <MapPin size={14} />
                {vendor.shopAddress}
              </div>
            )}
          </dl>

          {vendor.description && (
            <p className="mt-6 rounded-xl bg-cream-deep/50 p-4 text-sm text-cocoa-soft">{vendor.description}</p>
          )}

          <p className="mt-6 text-xs text-cocoa-soft">
            Joined {new Date(vendor.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
