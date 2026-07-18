import api from './api'

// Storefront browsing that works before login — hits /api/public/products,
// which is permitAll'd on the backend and only ever returns APPROVED products.
export const publicProductService = {
  browse: (params) => api.get('/public/products/browse', { params }).then((r) => r.data),
  getOne: (id) => api.get(`/public/products/${id}`).then((r) => r.data),
}
