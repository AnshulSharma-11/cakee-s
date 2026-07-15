import api from './api'

// Vendor-facing category/subcategory management (mounted under /api/vendor/**).
export const categoryService = {
  listCategories: () => api.get('/vendor/categories').then((r) => r.data),
  createCategory: (payload) => api.post('/vendor/categories', payload).then((r) => r.data),
  updateCategory: (id, payload) => api.put(`/vendor/categories/${id}`, payload).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/vendor/categories/${id}`).then((r) => r.data),

  listSubcategories: (categoryId) =>
    api.get('/vendor/subcategories', { params: categoryId ? { categoryId } : {} }).then((r) => r.data),
  createSubcategory: (payload) => api.post('/vendor/subcategories', payload).then((r) => r.data),
  updateSubcategory: (id, payload) => api.put(`/vendor/subcategories/${id}`, payload).then((r) => r.data),
  deleteSubcategory: (id) => api.delete(`/vendor/subcategories/${id}`).then((r) => r.data),
}
