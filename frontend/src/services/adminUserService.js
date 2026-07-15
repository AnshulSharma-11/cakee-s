import api from './api'

export const adminUserService = {
  listVendors: () => api.get('/admin/users/vendors').then((r) => r.data),
  getVendor: (id) => api.get(`/admin/users/vendors/${id}`).then((r) => r.data),
  listCustomers: () => api.get('/admin/users/customers').then((r) => r.data),
  getCustomer: (id) => api.get(`/admin/users/customers/${id}`).then((r) => r.data),
}
