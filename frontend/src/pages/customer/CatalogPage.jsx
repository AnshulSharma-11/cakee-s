import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ImageOff } from 'lucide-react'
import { customerProductService } from '../../services/customerProductService'
import { extractErrorMessage } from '../../services/errorUtils'
import Select from '../../components/ui/Select'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'basePrice:asc', label: 'Price: low to high' },
  { value: 'basePrice:desc', label: 'Price: high to low' },
  { value: 'name:asc', label: 'Name: A to Z' },
]

export default function CatalogPage() {
  const [keywordInput, setKeywordInput] = useState('')
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    subcategoryId: '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt:desc',
    page: 0,
  })

  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Facet lists are derived client-side from a broad browse call, since the
  // backend only exposes category/subcategory management under vendor-only
  // routes — there's no public taxonomy endpoint yet.
  const [facetProducts, setFacetProducts] = useState([])

  useEffect(() => {
    customerProductService
      .browse({ size: 100, sortBy: 'createdAt', direction: 'desc' })
      .then((res) => setFacetProducts(res.content))
      .catch(() => {})
  }, [])

  const categories = useMemo(() => {
    const map = new Map()
    facetProducts.forEach((p) => map.set(p.categoryId, p.categoryName))
    return [...map.entries()].map(([id, name]) => ({ id, name }))
  }, [facetProducts])

  const subcategories = useMemo(() => {
    const map = new Map()
    facetProducts
      .filter((p) => !filters.categoryId || String(p.categoryId) === String(filters.categoryId))
      .forEach((p) => map.set(p.subcategoryId, p.subcategoryName))
    return [...map.entries()].map(([id, name]) => ({ id, name }))
  }, [facetProducts, filters.categoryId])

  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, keyword: keywordInput, page: 0 })), 400)
    return () => clearTimeout(t)
  }, [keywordInput])

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
      sortBy,
      direction,
      page: filters.page,
      size: 12,
    }

    customerProductService
      .browse(params)
      .then((res) => active && setData(res))
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [filters])

  const updateFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value, page: 0, ...(key === 'categoryId' ? { subcategoryId: '' } : {}) }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-cocoa">Find your cake</h1>
        <p className="text-sm text-cocoa-soft">Browse cakes from bakers near you.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-2xl bg-card p-4 shadow-sm">
        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-cocoa-soft">Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-soft" />
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Search cakes…"
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
        >
          <option value="">All</option>
          {subcategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>

        <Select label="Sort by" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <Alert message={error} />

      {loading ? (
        <p className="py-16 text-center text-cocoa-soft">Loading cakes…</p>
      ) : data.content.length === 0 ? (
        <p className="py-16 text-center text-cocoa-soft">No cakes match these filters yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.content.map((p) => (
            <Link
              key={p.id}
              to={`/customer/products/${p.id}`}
              className="group rounded-2xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-blush-soft grid place-items-center overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <ImageOff size={28} className="text-cocoa-soft" />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-cocoa-soft">{p.subcategoryName}</p>
                <h3 className="font-display font-semibold text-cocoa mt-0.5">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold text-berry-dark">₹{Number(p.basePrice).toFixed(2)}</span>
                  <span className="text-xs text-cocoa-soft">{p.vendorShopName}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={filters.page} totalPages={data.totalPages || 0} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
    </div>
  )
}
