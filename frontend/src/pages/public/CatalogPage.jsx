import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ImageOff, Cake } from 'lucide-react'
import { publicProductService } from '../../services/publicProductService'
import { publicCategoryService } from '../../services/publicCategoryService'
import { extractErrorMessage } from '../../services/errorUtils'
import Select from '../../components/ui/Select'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'
import PhotoBackdrop from '../../components/ui/PhotoBackdrop'
import PHOTO, { unsplash } from '../../data/photos'

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'basePrice:asc', label: 'Price: low to high' },
  { value: 'basePrice:desc', label: 'Price: high to low' },
  { value: 'name:asc', label: 'Name: A to Z' },
]

export default function PublicCatalogPage() {
  const [keywordInput, setKeywordInput] = useState('')
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    subcategoryId: '',
    sort: 'createdAt:desc',
    page: 0,
  })

  const [data, setData] = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  useEffect(() => {
    publicCategoryService.listCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    publicCategoryService
      .listSubcategories(filters.categoryId || undefined)
      .then(setSubcategories)
      .catch(() => {})
  }, [filters.categoryId])

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
      sortBy,
      direction,
      page: filters.page,
      size: 12,
    }

    publicProductService
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
      <div className="relative overflow-hidden">
        <PhotoBackdrop src={unsplash(PHOTO.vanillaLayerCake, { w: 1800, h: 700 })} className="h-40 sm:h-52" />
        <div className="relative h-40 sm:h-52 flex items-center">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
            <div className="glass inline-flex items-center gap-3 rounded-2xl px-5 py-4">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-blush text-berry-dark shrink-0">
                <Cake size={20} />
              </span>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-cocoa">Browse our cakes</h1>
                <p className="text-sm text-cocoa-soft">No account needed — sign up when you're ready to order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 glass rounded-2xl p-4">
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

        <Select label="Sort by" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>

        {subcategories.length > 0 && (
          <div className="lg:col-span-4">
            <Select
              label="Subcategory"
              value={filters.subcategoryId}
              onChange={(e) => updateFilter('subcategoryId', e.target.value)}
              className="lg:max-w-xs"
            >
              <option value="">All subcategories</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        )}
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
              to={`/products/${p.id}`}
              className="group rounded-2xl bg-card/80 backdrop-blur border border-white/60 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="relative aspect-[4/3] bg-blush-soft grid place-items-center overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <ImageOff size={28} className="text-cocoa-soft" />
                )}
                <span className="glass-dark absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-cream">
                  ₹{Number(p.basePrice).toFixed(2)}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-cocoa-soft">{p.subcategoryName}</p>
                <h3 className="font-display font-semibold text-cocoa mt-0.5">{p.name}</h3>
                <p className="mt-1 text-xs text-cocoa-soft">{p.vendorShopName}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={filters.page} totalPages={data.totalPages || 0} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
      </div>
    </div>
  )
}
