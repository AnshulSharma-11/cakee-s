import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { homeForRole } from '../../components/ProtectedRoute'
import FormCard from '../../components/ui/FormCard'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import Logo from '../../components/ui/Logo'
import { extractErrorMessage } from '../../services/errorUtils'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      const redirectTo = location.state?.from?.pathname || homeForRole(res.role)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] grid place-items-center px-4 py-12">
      <div className="flex flex-col items-center gap-8">
        <Logo />
        <FormCard>
          <h1 className="font-display text-2xl font-semibold text-cocoa mb-1">Welcome back</h1>
          <p className="text-sm text-cocoa-soft mb-6">Log in to order or manage your bakery.</p>

          <Alert message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              <LogIn size={16} />
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-cocoa-soft">
            New here?{' '}
            <Link to="/register" className="font-semibold text-berry hover:text-berry-dark">
              Create an account
            </Link>
          </p>
        </FormCard>
      </div>
    </div>
  )
}
