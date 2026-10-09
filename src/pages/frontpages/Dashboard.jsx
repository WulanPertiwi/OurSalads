
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductFilter } from "../../context/ProductFilterContext";

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Chicken Salad Bowl",
    category: "Salad",
    price: 35000,
    rating: 4.9,
    reviews: 128,
    image: "/assets/chickensalad.jpg",
    description: "Salad segar dengan ayam dan sayuran pilihan.",
    label: "Banyak Disukai",
  },
  {
    id: 2,
    name: "Avocado Toast",
    category: "Toast",
    price: 28000,
    rating: 4.8,
    reviews: 96,
    image: "/assets/avocadotoast.jpg",
    description: "Roti panggang dengan alpukat yang creamy dan sehat.",
    label: "Favorit",
  },
  {
    id: 3,
    name: "Berry Smoothie",
    category: "Smoothie",
    price: 25000,
    rating: 4.9,
    reviews: 115,
    image: "/assets/berrysm.jpg",
    description: "Smoothie berry segar yang cocok untuk menemani harimu.",
    label: "Sering Dibeli",
  },
  {
    id: 4,
    name: "Granola Healthy Bowl",
    category: "Bowl",
    price: 30000,
    rating: 4.7,
    reviews: 74,
    image: "/assets/granola.jpg",
    description: "Granola dengan bahan sehat untuk sarapan bergizi.",
    label: "Sering Dibeli",
  },
  {
    id: 5,
    name: "Banana Oatmeal",
    category: "Oatmeal",
    price: 22000,
    rating: 4.8,
    reviews: 89,
    image: "/assets/bananaoatmeal.jpg",
    description: "Oatmeal lembut dengan pisang yang mengenyangkan.",
    label: "Sering Dibeli",
  },
  {
    id: 6,
    name: "Green Detox Juice",
    category: "Juice",
    price: 20000,
    rating: 4.6,
    reviews: 63,
    image: "/assets/greendetox.jpg",
    description: "Jus hijau segar untuk pilihan minuman yang lebih sehat.",
    label: "Favorit",
  },
];

function getSavedProducts() {
  try {
    const saved = localStorage.getItem("oursalads_products");

    if (saved === null) {
      return DEFAULT_PRODUCTS;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export default function Dashboard() {
  const { search, category } = useProductFilter();

  const [products, setProducts] = useState(getSavedProducts);

  useEffect(() => {
    // Sinkronkan perubahan produk dari halaman admin.
    const syncProducts = () => {
      setProducts(getSavedProducts());
    };

    // Perubahan localStorage dari tab lain.
    window.addEventListener("storage", syncProducts);

    // Perubahan dari halaman admin pada tab yang sama.
    window.addEventListener("oursalads-products-updated", syncProducts);

    // Ambil data terbaru saat halaman kembali aktif.
    window.addEventListener("focus", syncProducts);

    return () => {
      window.removeEventListener("storage", syncProducts);
      window.removeEventListener(
        "oursalads-products-updated",
        syncProducts
      );
      window.removeEventListener("focus", syncProducts);
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchSearch = (product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "Semua Kategori" ||
      product.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-[#3F6844]">
        Healthy Food untuk Hidup Lebih Sehat
      </h1>

      <p className="text-gray-600 mb-6">
        Pilih makanan dan minuman sehat favoritmu di OurSalads.
      </p>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#DDE8D9]">
          <p className="text-4xl mb-3">🥗</p>
          <h2 className="font-bold text-lg text-[#3F6844]">
            Produk tidak ditemukan
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Coba gunakan kata kunci atau kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-[#DDE8D9] rounded-xl overflow-hidden shadow-sm hover:shadow-lg bg-white transition"
            >
              {/* GAMBAR */}
              <div className="w-full aspect-square bg-[#F7F4E9] flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "/assets/chickensalad.jpg";
                    }}
                  />
                ) : (
                  <span className="text-7xl">
                    {product.icon || "🥗"}
                  </span>
                )}
              </div>

              {/* ISI PRODUK */}
              <div className="p-4">
                {product.label && (
                  <span className="inline-block bg-[#7fa374] text-[#f4faf5] px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    🔥 {product.label}
                  </span>
                )}

                <p className="text-sm text-[#5E8C61] font-medium">
                  {product.category}
                </p>

                <h2 className="font-bold text-lg text-[#3F6844] mt-1">
                  🥗 {product.name}
                </h2>

                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  📝 {product.description || "Produk sehat pilihan OurSalads."}
                </p>

                <div className="flex items-center gap-2 mt-3 text-sm">
                  <span className="text-yellow-500 font-medium">
                    ⭐ {product.rating ?? 5}
                  </span>

                  <span className="text-gray-500">
                    ({product.reviews ?? 0} ulasan)
                  </span>
                </div>

                <p className="font-bold text-xl text-[#3F6844] mt-3">
                  💰 Rp
                  {Number(product.price || 0).toLocaleString("id-ID")}
                </p>

                <Link
                  to={`/product/${product.id}`}
                  className="mt-4 block w-full text-center bg-[#5E8C61] text-white py-2.5 rounded-lg font-medium hover:bg-[#3F6844] transition"
                >
                  🛒 Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}