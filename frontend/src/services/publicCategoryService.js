import api from './api'

export const publicCategoryService = {
  listCategories: () => api.get('/public/categories').then((r) => r.data),
  listSubcategories: (categoryId) =>
    api.get('/public/subcategories', { params: categoryId ? { categoryId } : {} }).then((r) => r.data),
}
