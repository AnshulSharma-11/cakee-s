import api from './api'

export const vendorProductService = {
  list: (params) => api.get('/vendor/products', { params }).then((r) => r.data),
  create: (payload) => api.post('/vendor/products', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/vendor/products/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/vendor/products/${id}`).then((r) => r.data),
}
