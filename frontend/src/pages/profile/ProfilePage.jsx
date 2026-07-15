import { useEffect, useState } from 'react'
import { Pencil, Save, X, User, Store } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { profileService } from '../../services/profileService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { extractErrorMessage } from '../../services/errorUtils'

export default function ProfilePage() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    profileService
      .getMyProfile()
      .then((data) => {
        if (!active) return
        setProfile(data)
        setForm(data)
      })
      .catch((err) => active && setError(extractErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const startEdit = () => {
    setForm(profile)
    setSuccess('')
    setError('')
    setEditing(true)
  }

  const cancelEdit = () => {
    setForm(profile)
    setEditing(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const updated = await profileService.updateMyProfile(form)
      setProfile(updated)
      setEditing(false)
      setSuccess('Profile updated.')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="px-6 py-16 text-center text-cocoa-soft">Loading your profile…</div>
  }

  const isVendor = user?.role === 'VENDOR'

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid place-items-center w-12 h-12 rounded-full bg-blush text-berry-dark">
          {isVendor ? <Store size={22} /> : <User size={22} />}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cocoa">My profile</h1>
          <p className="text-sm text-cocoa-soft">{profile?.role?.toLowerCase()} account</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card overflow-hidden shadow-[0_20px_50px_-20px_rgba(74,59,53,0.2)]">
        <div className="scallop-top" />
        <div className="px-8 py-8">
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Full name" name="name" value={form.name || ''} onChange={handleChange} disabled={!editing} />
            <Input label="Email" name="email" value={form.email || ''} disabled />
            <Input label="Phone" name="phone" value={form.phone || ''} onChange={handleChange} disabled={!editing} />

            {isVendor && (
              <>
                <Input
                  label="Shop name"
                  name="shopName"
                  value={form.shopName || ''}
                  onChange={handleChange}
                  disabled={!editing}
                />
                <Input
                  label="Shop address"
                  name="shopAddress"
                  value={form.shopAddress || ''}
                  onChange={handleChange}
                  disabled={!editing}
                />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-cocoa-soft">Description</span>
                  <textarea
                    name="description"
                    rows={3}
                    value={form.description || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-blush bg-card px-4 py-2.5 text-cocoa outline-none transition-colors focus:border-berry focus:ring-2 focus:ring-berry/40 disabled:text-cocoa-soft"
                  />
                </label>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              {editing ? (
                <>
                  <Button type="button" variant="secondary" onClick={cancelEdit}>
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button type="submit" loading={saving}>
                    <Save size={16} />
                    Save changes
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={startEdit}>
                  <Pencil size={16} />
                  Edit profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
