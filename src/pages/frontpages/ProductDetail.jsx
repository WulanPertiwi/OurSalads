
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Chicken Salad Bowl",
    category: "Salad",
    description:
      "Salad segar dengan ayam, sayuran pilihan, dan dressing yang lezat. Cocok untuk kamu yang ingin menikmati makanan sehat dan mengenyangkan.",
    price: 35000,
    rating: 4.9,
    reviews: 128,
    image: "/assets/chickensalad.jpg",
    label: "Banyak Disukai",
  },
  {
    id: 2,
    name: "Avocado Toast",
    category: "Toast",
    description:
      "Roti panggang dengan alpukat yang creamy dan kaya nutrisi. Cocok untuk sarapan sehat.",
    price: 28000,
    rating: 4.8,
    reviews: 96,
    image: "/assets/avocadotoast.jpg",
    label: "Favorit",
  },
  {
    id: 3,
    name: "Berry Smoothie",
    category: "Smoothie",
    description:
      "Smoothie segar dengan campuran buah berry yang lezat dan menyegarkan.",
    price: 25000,
    rating: 4.9,
    reviews: 115,
    image: "/assets/berrysm.jpg",
    label: "Sering Dibeli",
  },
  {
    id: 4,
    name: "Granola Healthy Bowl",
    category: "Bowl",
    description:
      "Granola dengan bahan sehat yang cocok untuk sarapan dan menjaga energi sepanjang hari.",
    price: 30000,
    rating: 4.7,
    reviews: 74,
    image: "/assets/granola.jpg",
    label: "Sering Dibeli",
  },
  {
    id: 5,
    name: "Banana Oatmeal",
    category: "Oatmeal",
    description:
      "Oatmeal lembut dengan potongan pisang yang mengenyangkan dan cocok untuk sarapan.",
    price: 22000,
    rating: 4.8,
    reviews: 89,
    image: "/assets/bananaoatmeal.jpg",
    label: "Sering Dibeli",
  },
  {
    id: 6,
    name: "Green Detox Juice",
    category: "Juice",
    description:
      "Jus hijau segar dengan perpaduan sayuran dan buah untuk pilihan minuman yang lebih sehat.",
    price: 20000,
    rating: 4.6,
    reviews: 63,
    image: "/assets/greendetox.jpg",
    label: "Favorit",
  },
];

function getProducts() {
  try {
    const saved = localStorage.getItem("oursalads_products");

    if (saved === null) return DEFAULT_PRODUCTS;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return DEFAULT_PRODUCTS;

    return parsed.map((item) => {
      const fallback = DEFAULT_PRODUCTS.find(
        (product) => String(product.id) === String(item.id)
      );

      return {
        ...fallback,
        ...item,
        description:
          item.description || fallback?.description || "",
        rating: item.rating ?? fallback?.rating ?? 5,
        reviews: item.reviews ?? fallback?.reviews ?? 0,
        label: item.label ?? fallback?.label ?? "",
      };
    });
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState(getProducts);
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const syncProducts = () => setProducts(getProducts());

    window.addEventListener("storage", syncProducts);
    window.addEventListener("oursalads-products-updated", syncProducts);
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

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  const handleAddToCart = () => {
    if (!product) return;

    let cart = [];

    try {
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      cart = Array.isArray(savedCart) ? savedCart : [];
    } catch {
      cart = [];
    }

    const existingProduct = cart.find(
      (item) => String(item.id) === String(product.id)
    );

    if (existingProduct) {
      existingProduct.quantity =
        (Number(existingProduct.quantity) || 0) + quantity;
      existingProduct.name = product.name;
      existingProduct.category = product.category;
      existingProduct.price = Number(product.price) || 0;
      existingProduct.image = product.image;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price) || 0,
        image: product.image,
        icon: product.icon,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowPopup(true);
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto bg-white border border-[#DDE8D9] rounded-xl p-8 text-center">
        <p className="text-4xl mb-3">🥗</p>
        <h1 className="text-xl font-bold text-[#3F6844]">
          Produk tidak ditemukan
        </h1>
        <p className="text-gray-600 mt-2">
          Produk mungkin sudah dihapus dari halaman admin.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-[#5E8C61] text-white px-5 py-2.5 rounded-lg hover:bg-[#3F6844]"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#D3F2DA] flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-[#5E8C61]">
                ✓
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#3F6844]">
              Berhasil Ditambahkan!
            </h2>

            <p className="text-gray-600 text-sm mt-2">
              <span className="font-semibold text-[#5E8C61]">
                {product.name}
              </span>{" "}
              sudah masuk ke keranjang kamu.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 border border-[#5E8C61] text-[#5E8C61] py-2.5 rounded-lg font-medium hover:bg-[#F7F4E9]"
              >
                Lanjut Belanja
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="flex-1 bg-[#5E8C61] text-white py-2.5 rounded-lg font-medium hover:bg-[#3F6844]"
              >
                Ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#DDE8D9] rounded-xl p-6 shadow-sm">
          <div className="w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden bg-[#F7F4E9] flex items-center justify-center">
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
              <span className="text-8xl">
                {product.icon || "🥗"}
              </span>
            )}
          </div>

          {product.label && (
            <span className="inline-block bg-[#A8C3A0] text-[#3F6844] px-3 py-1 rounded-full text-sm font-medium mt-5">
              {product.label}
            </span>
          )}

          <p className="text-[#5E8C61] font-medium mt-4">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold text-[#3F6844] mt-1">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-yellow-500">
              ⭐ {product.rating}
            </span>
            <span className="text-gray-500">
              ({product.reviews} ulasan)
            </span>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">
            {product.description || "Produk sehat pilihan OurSalads."}
          </p>

          <p className="text-2xl font-bold text-[#3F6844] mt-6">
            Rp{Number(product.price || 0).toLocaleString("id-ID")}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <span className="font-semibold text-[#3F6844]">
              Jumlah
            </span>

            <div className="flex items-center border border-[#A8C3A0] rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                className="w-10 h-10 text-lg font-bold text-[#3F6844] hover:bg-[#D3F2DA]"
              >
                −
              </button>

              <span className="w-12 text-center font-semibold text-[#3F6844]">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-10 text-lg font-bold text-[#3F6844] hover:bg-[#D3F2DA]"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-[#5E8C61] text-white py-3 rounded-lg hover:bg-[#3F6844] transition"
          >
            🛒 Tambahkan ke Keranjang
          </button>
        </div>
      </div>
    </>
  );
}