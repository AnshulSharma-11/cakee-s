import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, ImageOff } from 'lucide-react'
import { vendorProductService } from '../../services/vendorProductService'
import { categoryService } from '../../services/categoryService'
import { extractErrorMessage } from '../../services/errorUtils'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'basePrice:asc', label: 'Price: low to high' },
  { value: 'basePrice:desc', label: 'Price: high to low' },
  { value: 'name:asc', label: 'Name: A to Z' },
]

const emptyFilters = {
  keyword: '',
  categoryId: '',
  subcategoryId: '',
  minPrice: '',
  maxPrice: '',
  status: '',
  sort: 'createdAt:desc',
  page: 0,
}

export default function ProductListPage() {
  const [keywordInput, setKeywordInput] = useState('')
  const [filters, setFilters] = useState(emptyFilters)

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // debounce keyword -> filters.keyword
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, keyword: keywordInput, page: 0 }))
    }, 400)
    return () => clearTimeout(t)
  }, [keywordInput])

  useEffect(() => {
    categoryService.listCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!filters.categoryId) {
      setSubcategories([])
      return
    }
    categoryService.listSubcategories(filters.categoryId).then(setSubcategories).catch(() => {})
  }, [filters.categoryId])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    const [sortBy, direction] = filters.sort.split(':')
    const params = {
      keyword: filters.keyword || undefined,
      categoryId: filters.categoryId || undefined,
      subcategoryId: filters.subcategoryId || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      status: filters.status || undefined,
      sortBy,
      direction,
      page: filters.page,
      size: 10,
    }

    vendorProductService
      .list(params)
      .then((res) => active && setData(res))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [filters])

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 0 }))

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await vendorProductService.remove(deleteTarget.id)
      setDeleteTarget(null)
      setFilters((f) => ({ ...f })) // re-trigger fetch
    } catch (err) {
      setError(extractErrorMessage(err))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cocoa">My products</h1>
          <p className="text-sm text-cocoa-soft">Manage what's on your shelf.</p>
        </div>
        <Link to="/vendor/products/new">
          <Button>
            <Plus size={16} />
            Add product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 rounded-2xl bg-card p-4 shadow-sm">
        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-cocoa-soft">Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-soft" />
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Search by name or description"
              className="w-full rounded-xl border border-blush bg-card pl-9 pr-4 py-2.5 text-cocoa outline-none focus:border-berry focus:ring-2 focus:ring-berry/40"
            />
          </div>
        </div>

        <Select label="Category" value={filters.categoryId} onChange={(e) => updateFilter('categoryId', e.target.value)}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          label="Subcategory"
          value={filters.subcategoryId}
          onChange={(e) => updateFilter('subcategoryId', e.target.value)}
          disabled={!filters.categoryId}
        >
          <option value="">All</option>
          {subcategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>

        <Select label="Status" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>

        <Select label="Sort by" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>

        <Input
          label="Min price"
          type="number"
          min="0"
          value={filters.minPrice}
          onChange={(e) => updateFilter('minPrice', e.target.value)}
        />
        <Input
          label="Max price"
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={(e) => updateFilter('maxPrice', e.target.value)}
        />
      </div>

      <Alert message={error} />

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blush text-left text-cocoa-soft">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-cocoa-soft">
                  Loading products…
                </td>
              </tr>
            ) : data.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-cocoa-soft">
                  No products match these filters yet.
                </td>
              </tr>
            ) : (
              data.content.map((p) => (
                <tr key={p.id} className="border-b border-blush/60 last:border-0 hover:bg-cream-deep/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid place-items-center w-10 h-10 shrink-0 rounded-lg bg-blush-soft overflow-hidden">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff size={16} className="text-cocoa-soft" />
                        )}
                      </div>
                      <span className="font-medium text-cocoa">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-cocoa-soft">{p.subcategoryName}</td>
                  <td className="px-5 py-3 text-cocoa">₹{Number(p.basePrice).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/vendor/products/${p.id}/edit`}
                        state={{ product: p }}
                        className="grid place-items-center w-8 h-8 rounded-full text-cocoa-soft hover:bg-cream-deep hover:text-cocoa"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="grid place-items-center w-8 h-8 rounded-full text-cocoa-soft hover:bg-berry/10 hover:text-berry-dark"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={filters.page} totalPages={data.totalPages || 0} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed from your shop.` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
