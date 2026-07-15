import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Store, MapPin, Package } from 'lucide-react'
import { vendorPublicService } from '../../services/vendorPublicService'
import { extractErrorMessage } from '../../services/errorUtils'
import Alert from '../../components/ui/Alert'

export default function VendorProfilePage() {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    vendorPublicService
      .getVendor(vendorId)
      .then((data) => active && setVendor(data))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [vendorId])

  if (loading) return <p className="py-16 text-center text-cocoa-soft">Loading shop…</p>
  if (error) return <Alert message={error} />
  if (!vendor) return null

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/customer/catalog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cocoa-soft hover:text-cocoa">
        <ArrowLeft size={15} />
        Back to catalog
      </Link>

      <div className="rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="scallop-top" />
        <div className="px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-14 h-14 rounded-full bg-blush text-berry-dark overflow-hidden">
              {vendor.logoUrl ? (
                <img src={vendor.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Store size={24} />
              )}
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-cocoa">{vendor.shopName}</h1>
              <p className="text-sm text-cocoa-soft flex items-center gap-1">
                <Package size={13} />
                {vendor.approvedProductCount} cake{vendor.approvedProductCount !== 1 ? 's' : ''} on the shelf
              </p>
            </div>
          </div>

          {vendor.description && <p className="text-cocoa-soft mb-4">{vendor.description}</p>}

          {vendor.shopAddress && (
            <div className="flex items-start gap-2 text-sm text-cocoa-soft">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              {vendor.shopAddress}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
