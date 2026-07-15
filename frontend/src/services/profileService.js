import api from './api'

export const profileService = {
  getMyProfile: () => api.get('/profile/me').then((r) => r.data),
  updateMyProfile: (payload) => api.put('/profile/me', payload).then((r) => r.data),
}
