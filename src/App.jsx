import { Routes, Route } from "react-router-dom";
import { ProductFilterProvider } from "./context/ProductFilterContext";

// =========================
// LAYOUT ADMIN
// =========================
import AdminLayout from "./layouts/AdminLayout";

// =========================
// HALAMAN ADMIN
// =========================
import AdminDashboard from "./pages/adminpages/AdminDashboard";
import AboutPage from "./pages/adminpages/AboutPage";
import ProductsPage from "./pages/adminpages/ProductsPage";
import OrdersPage from "./pages/adminpages/OrdersPage";

// =========================
// LAYOUT FRONTEND
// =========================
import MainLayout from "./layouts/MainLayout";

// =========================
// HALAMAN FRONTEND
// =========================
import Dashboard from "./pages/frontpages/Dashboard";
import ProductDetail from "./pages/frontpages/ProductDetail";
import Cart from "./pages/frontpages/Cart";
import Checkout from "./pages/frontpages/Checkout";

export default function App() {
  return (
    <ProductFilterProvider>
    <Routes>

      {/* ==================================================
          WEBSITE UTAMA OURSALADS
      ================================================== */}
      <Route path="/" element={<MainLayout />}>

        {/* Halaman utama */}
        <Route
          index
          element={<Dashboard />}
        />

        {/* Detail produk */}
        <Route
          path="product/:id"
          element={<ProductDetail />}
        />

        {/* Keranjang */}
        <Route
          path="cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="checkout"
          element={<Checkout />}
        />

      </Route>


      {/* ==================================================
          ADMIN OURSALADS
      ================================================== */}
      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        {/* Dashboard Admin */}
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        {/* Manajemen Produk */}
        <Route
          path="products"
          element={<ProductsPage />}
        />

        {/* Manajemen Pesanan */}
        <Route
          path="orders"
          element={<OrdersPage />}
        />

        {/* About */}
        <Route
          path="about"
          element={<AboutPage />}
        />

      </Route>

    </Routes>
    </ProductFilterProvider>
  );
}