import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Tags, Layers } from 'lucide-react'
import { categoryService } from '../../services/categoryService'
import { extractErrorMessage } from '../../services/errorUtils'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function CategoryManagerPage() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [categoryForm, setCategoryForm] = useState({ id: null, name: '' })
  const [subcategoryForm, setSubcategoryForm] = useState({ id: null, name: '' })
  const [savingCategory, setSavingCategory] = useState(false)
  const [savingSubcategory, setSavingSubcategory] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'category'|'subcategory', id, name }
  const [deleting, setDeleting] = useState(false)

  const loadCategories = () =>
    categoryService
      .listCategories()
      .then((data) => {
        setCategories(data)
        if (!selectedCategoryId && data.length) setSelectedCategoryId(String(data[0].id))
      })
      .catch((err) => setError(extractErrorMessage(err)))

  const loadSubcategories = (categoryId) => {
    if (!categoryId) {
      setSubcategories([])
      return
    }
    categoryService
      .listSubcategories(categoryId)
      .then(setSubcategories)
      .catch((err) => setError(extractErrorMessage(err)))
  }

  useEffect(() => {
    setLoading(true)
    loadCategories().finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadSubcategories(selectedCategoryId)
  }, [selectedCategoryId])

  const flash = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 2500)
  }

  // --- category form ---
  const submitCategory = async (e) => {
    e.preventDefault()
    setError('')
    setSavingCategory(true)
    try {
      if (categoryForm.id) {
        await categoryService.updateCategory(categoryForm.id, { name: categoryForm.name })
        flash('Category updated.')
      } else {
        await categoryService.createCategory({ name: categoryForm.name })
        flash('Category added.')
      }
      setCategoryForm({ id: null, name: '' })
      await loadCategories()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSavingCategory(false)
    }
  }

  // --- subcategory form ---
  const submitSubcategory = async (e) => {
    e.preventDefault()
    if (!selectedCategoryId) return
    setError('')
    setSavingSubcategory(true)
    try {
      const payload = { name: subcategoryForm.name, categoryId: Number(selectedCategoryId) }
      if (subcategoryForm.id) {
        await categoryService.updateSubcategory(subcategoryForm.id, payload)
        flash('Subcategory updated.')
      } else {
        await categoryService.createSubcategory(payload)
        flash('Subcategory added.')
      }
      setSubcategoryForm({ id: null, name: '' })
      loadSubcategories(selectedCategoryId)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSavingSubcategory(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.type === 'category') {
        await categoryService.deleteCategory(deleteTarget.id)
        await loadCategories()
        if (String(deleteTarget.id) === selectedCategoryId) setSelectedCategoryId('')
      } else {
        await categoryService.deleteSubcategory(deleteTarget.id)
        loadSubcategories(selectedCategoryId)
      }
      flash('Deleted.')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-cocoa-soft">Loading categories…</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-cocoa">Categories & subcategories</h1>
        <p className="text-sm text-cocoa-soft">Organize your shelf so customers can find things fast.</p>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-cocoa">
            <Tags size={18} />
            <h2 className="font-display text-lg font-semibold">Categories</h2>
          </div>

          <form onSubmit={submitCategory} className="mb-4 flex gap-2">
            <Input
              className="flex-1"
              placeholder={categoryForm.id ? 'Edit category name' : 'New category name'}
              value={categoryForm.name}
              onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Button type="submit" loading={savingCategory}>
              {categoryForm.id ? 'Save' : <Plus size={16} />}
            </Button>
            {categoryForm.id && (
              <Button type="button" variant="secondary" onClick={() => setCategoryForm({ id: null, name: '' })}>
                Cancel
              </Button>
            )}
          </form>

          <ul className="divide-y divide-blush/60">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5">
                <button
                  onClick={() => setSelectedCategoryId(String(c.id))}
                  className={`text-sm font-medium ${
                    String(c.id) === selectedCategoryId ? 'text-berry-dark' : 'text-cocoa hover:text-berry'
                  }`}
                >
                  {c.name}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCategoryForm({ id: c.id, name: c.name })}
                    className="grid place-items-center w-7 h-7 rounded-full text-cocoa-soft hover:bg-cream-deep hover:text-cocoa"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'category', id: c.id, name: c.name })}
                    className="grid place-items-center w-7 h-7 rounded-full text-cocoa-soft hover:bg-berry/10 hover:text-berry-dark"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
            {categories.length === 0 && <li className="py-3 text-sm text-cocoa-soft">No categories yet.</li>}
          </ul>
        </div>

        {/* Subcategories */}
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-cocoa">
            <Layers size={18} />
            <h2 className="font-display text-lg font-semibold">Subcategories</h2>
          </div>

          <Select
            label="For category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="mb-4"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <form onSubmit={submitSubcategory} className="mb-4 flex gap-2">
            <Input
              className="flex-1"
              placeholder={subcategoryForm.id ? 'Edit subcategory name' : 'New subcategory name'}
              value={subcategoryForm.name}
              onChange={(e) => setSubcategoryForm((f) => ({ ...f, name: e.target.value }))}
              disabled={!selectedCategoryId}
              required
            />
            <Button type="submit" loading={savingSubcategory} disabled={!selectedCategoryId}>
              {subcategoryForm.id ? 'Save' : <Plus size={16} />}
            </Button>
            {subcategoryForm.id && (
              <Button type="button" variant="secondary" onClick={() => setSubcategoryForm({ id: null, name: '' })}>
                Cancel
              </Button>
            )}
          </form>

          <ul className="divide-y divide-blush/60">
            {subcategories.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium text-cocoa">{s.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSubcategoryForm({ id: s.id, name: s.name })}
                    className="grid place-items-center w-7 h-7 rounded-full text-cocoa-soft hover:bg-cream-deep hover:text-cocoa"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'subcategory', id: s.id, name: s.name })}
                    className="grid place-items-center w-7 h-7 rounded-full text-cocoa-soft hover:bg-berry/10 hover:text-berry-dark"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
            {selectedCategoryId && subcategories.length === 0 && (
              <li className="py-3 text-sm text-cocoa-soft">No subcategories yet.</li>
            )}
          </ul>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete this ${deleteTarget?.type}?`}
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed.` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
