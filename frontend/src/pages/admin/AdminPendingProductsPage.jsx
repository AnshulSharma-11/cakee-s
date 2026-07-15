import { useEffect, useState } from 'react'
import { Check, X, Trash2, ImageOff } from 'lucide-react'
import { adminProductService } from '../../services/adminProductService'
import { extractErrorMessage } from '../../services/errorUtils'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function AdminPendingProductsPage() {
  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    return adminProductService
      .listPending({ page, size: 10 })
      .then(setData)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const flash = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 2500)
  }

  const handleApprove = async (product) => {
    setBusyId(product.id)
    setError('')
    try {
      await adminProductService.approve(product.id)
      flash(`"${product.name}" approved.`)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (product) => {
    setBusyId(product.id)
    setError('')
    try {
      await adminProductService.reject(product.id)
      flash(`"${product.name}" rejected.`)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminProductService.remove(deleteTarget.id)
      flash(`"${deleteTarget.name}" deleted.`)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setError(extractErrorMessage(err))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-cocoa">Pending products</h1>
        <p className="text-sm text-cocoa-soft">Review new and edited listings before they go live.</p>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {loading ? (
        <p className="py-16 text-center text-cocoa-soft">Loading queue…</p>
      ) : data.content.length === 0 ? (
        <p className="py-16 text-center text-cocoa-soft">Nothing waiting for review. 🎉</p>
      ) : (
        <div className="space-y-3">
          {data.content.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
              <div className="w-16 h-16 shrink-0 rounded-xl bg-blush-soft grid place-items-center overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={18} className="text-cocoa-soft" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-cocoa truncate">{p.name}</h3>
                <p className="text-sm text-cocoa-soft">
                  {p.vendorShopName} • {p.categoryName} / {p.subcategoryName}
                </p>
                <p className="text-sm font-semibold text-berry-dark">₹{Number(p.basePrice).toFixed(2)}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" onClick={() => handleReject(p)} loading={busyId === p.id}>
                  <X size={15} />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(p)} loading={busyId === p.id}>
                  <Check size={15} />
                  Approve
                </Button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="grid place-items-center w-9 h-9 rounded-full text-cocoa-soft hover:bg-berry/10 hover:text-berry-dark"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data.totalPages || 0} onChange={setPage} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed.` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
