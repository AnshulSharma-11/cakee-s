import api from './api'

export const customerProductService = {
  browse: (params) => api.get('/customer/products/browse', { params }).then((r) => r.data),
  getOne: (id) => api.get(`/customer/products/${id}`).then((r) => r.data),
}
