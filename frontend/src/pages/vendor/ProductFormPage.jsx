import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { vendorProductService } from '../../services/vendorProductService'
import { categoryService } from '../../services/categoryService'
import { extractErrorMessage } from '../../services/errorUtils'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

const emptyForm = {
  name: '',
  description: '',
  basePrice: '',
  imageUrl: '',
  categoryId: '',
  subcategoryId: '',
}

export default function ProductFormPage() {
  const { productId } = useParams()
  const isEdit = !!productId
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoryService.listCategories().then(setCategories).catch(() => {})
  }, [])

  // Prefill from the product passed via navigation state (from the list page).
  // Backend has no single-product GET for vendors, so if state is missing
  // (e.g. direct URL visit) we fall back to scanning the vendor's own list.
  useEffect(() => {
    if (!isEdit) return

    const prefill = (p) => {
      setForm({
        name: p.name,
        description: p.description || '',
        basePrice: p.basePrice,
        imageUrl: p.imageUrl || '',
        categoryId: String(p.categoryId),
        subcategoryId: String(p.subcategoryId),
      })
      setLoading(false)
    }

    const stateProduct = location.state?.product
    if (stateProduct) {
      prefill(stateProduct)
      return
    }

    vendorProductService
      .list({ size: 100 })
      .then((res) => {
        const found = res.content.find((p) => String(p.id) === productId)
        if (found) prefill(found)
        else setError('Could not find this product.')
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [isEdit, productId, location.state])

  useEffect(() => {
    if (!form.categoryId) {
      setSubcategories([])
      return
    }
    categoryService.listSubcategories(form.categoryId).then(setSubcategories).catch(() => {})
  }, [form.categoryId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value, ...(name === 'categoryId' ? { subcategoryId: '' } : {}) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      name: form.name,
      description: form.description,
      basePrice: Number(form.basePrice),
      imageUrl: form.imageUrl,
      subcategoryId: Number(form.subcategoryId),
    }

    try {
      if (isEdit) {
        await vendorProductService.update(productId, payload)
      } else {
        await vendorProductService.create(payload)
      }
      navigate('/vendor/products')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/vendor/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cocoa-soft hover:text-cocoa">
        <ArrowLeft size={15} />
        Back to products
      </Link>

      <div className="rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="scallop-top" />
        <div className="px-8 py-8">
          <h1 className="font-display text-2xl font-semibold text-cocoa mb-1">
            {isEdit ? 'Edit product' : 'Add a new product'}
          </h1>
          <p className="text-sm text-cocoa-soft mb-6">
            {isEdit
              ? 'Changes will re-enter the admin approval queue.'
              : 'New products need admin approval before customers can see them.'}
          </p>

          <Alert message={error} />

          {loading ? (
            <p className="py-8 text-center text-cocoa-soft">Loading product…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Product name" name="name" value={form.name} onChange={handleChange} required />

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-cocoa-soft">Description</span>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blush bg-card px-4 py-2.5 text-cocoa outline-none focus:border-berry focus:ring-2 focus:ring-berry/40"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Base price (₹)"
                  type="number"
                  name="basePrice"
                  min="0"
                  step="0.01"
                  value={form.basePrice}
                  onChange={handleChange}
                  required
                />
                <Input label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Optional" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Subcategory"
                  name="subcategoryId"
                  value={form.subcategoryId}
                  onChange={handleChange}
                  disabled={!form.categoryId}
                  required
                >
                  <option value="" disabled>
                    Select subcategory
                  </option>
                  {subcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => navigate('/vendor/products')}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving}>
                  <Save size={16} />
                  {isEdit ? 'Save changes' : 'Add product'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
