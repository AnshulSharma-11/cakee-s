import api from './api'

export const authService = {
  registerVendor: (payload) => api.post('/auth/register/vendor', payload).then((r) => r.data),
  registerCustomer: (payload) => api.post('/auth/register/customer', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
}
