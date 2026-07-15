import api from './api'

export const vendorPublicService = {
  getVendor: (vendorId) => api.get(`/customer/vendors/${vendorId}`).then((r) => r.data),
}
