import api from './api'

export const orderService = {
  placeOrder: (payload) => api.post('/customer/orders', payload).then((r) => r.data),
  listMine: () => api.get('/customer/orders').then((r) => r.data),
  getOne: (id) => api.get(`/customer/orders/${id}`).then((r) => r.data),
}
