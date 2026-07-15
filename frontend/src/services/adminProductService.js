import api from './api'

export const adminProductService = {
  listPending: (params) => api.get('/admin/products/pending', { params }).then((r) => r.data),
  approve: (id) => api.put(`/admin/products/${id}/approve`).then((r) => r.data),
  reject: (id) => api.put(`/admin/products/${id}/reject`).then((r) => r.data),
  remove: (id) => api.delete(`/admin/products/${id}`).then((r) => r.data),
}
