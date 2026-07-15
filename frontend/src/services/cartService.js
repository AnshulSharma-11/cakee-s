import api from './api'

export const cartService = {
  getCart: () => api.get('/customer/cart').then((r) => r.data),
  addItem: (payload) => api.post('/customer/cart/items', payload).then((r) => r.data),
  updateItem: (itemId, payload) => api.put(`/customer/cart/items/${itemId}`, payload).then((r) => r.data),
  removeItem: (itemId) => api.delete(`/customer/cart/items/${itemId}`).then((r) => r.data),
  clear: () => api.delete('/customer/cart').then((r) => r.data),
}
