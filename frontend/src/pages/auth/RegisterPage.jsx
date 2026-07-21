import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserPlus, Store, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { homeForRole } from '../../components/ProtectedRoute'
import FormCard from '../../components/ui/FormCard'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import Logo from '../../components/ui/Logo'
import PhotoBackdrop from '../../components/ui/PhotoBackdrop'
import PHOTO, { unsplash } from '../../data/photos'
import { extractErrorMessage } from '../../services/errorUtils'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  shopName: '',
  shopAddress: '',
}

export default function RegisterPage() {
  const { registerVendor, registerCustomer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [role, setRole] = useState('CUSTOMER')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res =
        role === 'VENDOR'
          ? await registerVendor({
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone,
              shopName: form.shopName,
              shopAddress: form.shopAddress,
            })
          : await registerCustomer({
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone,
            })
      const redirectTo = res.role === 'CUSTOMER' && location.state?.from?.pathname
        ? location.state.from.pathname
        : homeForRole(res.role)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[85vh] grid place-items-center px-4 py-12 overflow-hidden">
      <PhotoBackdrop src={unsplash(PHOTO.birthdayCake, { w: 1800, h: 1400 })} blur />
      <div className="flex flex-col items-center gap-8">
        <div className="glass rounded-full px-4 py-2">
          <Logo />
        </div>
        <FormCard className="max-w-lg">
          <h1 className="font-display text-2xl font-semibold text-cocoa mb-1">Create your account</h1>
          <p className="text-sm text-cocoa-soft mb-6">Order custom cakes, or sell your own.</p>

          {/* Role toggle */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-cream-deep p-1">
            {[
              { key: 'CUSTOMER', label: 'Customer', icon: ShoppingBag },
              { key: 'VENDOR', label: 'Vendor', icon: Store },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-colors ${
                  role === key ? 'bg-berry text-cream shadow-sm' : 'text-cocoa-soft hover:text-cocoa'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <Alert message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} required />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
            <Input label="Phone" name="phone" placeholder="Optional" value={form.phone} onChange={handleChange} />

            {role === 'VENDOR' && (
              <>
                <Input
                  label="Shop name"
                  name="shopName"
                  placeholder="e.g. Sugar & Spice Bakery"
                  value={form.shopName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Shop address"
                  name="shopAddress"
                  placeholder="Optional"
                  value={form.shopAddress}
                  onChange={handleChange}
                />
              </>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              <UserPlus size={16} />
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-cocoa-soft">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-berry hover:text-berry-dark">
              Log in
            </Link>
          </p>
        </FormCard>
      </div>
    </div>
  )
}
