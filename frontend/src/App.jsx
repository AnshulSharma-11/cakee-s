import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import VendorLayout from './layouts/VendorLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/profile/ProfilePage'

import PublicCatalogPage from './pages/public/CatalogPage'
import PublicProductDetailPage from './pages/public/ProductDetailPage'

import ProductListPage from './pages/vendor/ProductListPage'
import ProductFormPage from './pages/vendor/ProductFormPage'
import CategoryManagerPage from './pages/vendor/CategoryManagerPage'

import CatalogPage from './pages/customer/CatalogPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrdersPage from './pages/customer/OrdersPage'
import OrderDetailPage from './pages/customer/OrderDetailPage'
import VendorProfilePage from './pages/customer/VendorProfilePage'

import AdminPendingProductsPage from './pages/admin/AdminPendingProductsPage'
import AdminVendorsPage from './pages/admin/AdminVendorsPage'
import AdminVendorDetailPage from './pages/admin/AdminVendorDetailPage'
import AdminCustomersPage from './pages/admin/AdminCustomersPage'
import AdminCustomerDetailPage from './pages/admin/AdminCustomerDetailPage'

import NotFound from './pages/misc/NotFound'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* public storefront — browsable before login */}
            <Route path="/products" element={<PublicCatalogPage />} />
            <Route path="/products/:productId" element={<PublicProductDetailPage />} />

            {/* any authenticated role */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* vendor-only */}
            <Route element={<ProtectedRoute roles={['VENDOR']} />}>
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<Navigate to="products" replace />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/:productId/edit" element={<ProductFormPage />} />
                <Route path="categories" element={<CategoryManagerPage />} />
              </Route>
            </Route>

            {/* customer-only */}
            <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<Navigate to="catalog" replace />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="products/:productId" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:orderId" element={<OrderDetailPage />} />
                <Route path="vendors/:vendorId" element={<VendorProfilePage />} />
              </Route>
            </Route>

            {/* admin-only */}
            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="pending" replace />} />
                <Route path="pending" element={<AdminPendingProductsPage />} />
                <Route path="vendors" element={<AdminVendorsPage />} />
                <Route path="vendors/:vendorId" element={<AdminVendorDetailPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="customers/:customerId" element={<AdminCustomerDetailPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
