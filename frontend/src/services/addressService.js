import api from './api'

export const addressService = {
  list: () => api.get('/customer/addresses').then((r) => r.data),
  create: (payload) => api.post('/customer/addresses', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/customer/addresses/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/customer/addresses/${id}`).then((r) => r.data),
}
