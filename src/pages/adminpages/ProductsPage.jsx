
import { useEffect, useState } from "react";

const STORAGE_KEY = "oursalads_products";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Chicken Salad Bowl",
    category: "Salad",
    price: 35000,
    stock: 20,
    rating: 4.9,
    reviews: 128,
    description:
      "Salad segar dengan ayam, sayuran pilihan, dan dressing yang lezat. Cocok untuk kamu yang ingin menikmati makanan sehat dan mengenyangkan.",
    image: "/assets/chickensalad.jpg",
    label: "Banyak Disukai",
  },
  {
    id: 2,
    name: "Avocado Toast",
    category: "Toast",
    price: 28000,
    stock: 15,
    rating: 4.8,
    reviews: 96,
    description:
      "Roti panggang dengan alpukat yang creamy dan kaya nutrisi. Cocok untuk sarapan sehat.",
    image: "/assets/avocadotoast.jpg",
    label: "Favorit",
  },
  {
    id: 3,
    name: "Berry Smoothie",
    category: "Smoothie",
    price: 25000,
    stock: 18,
    rating: 4.9,
    reviews: 115,
    description:
      "Smoothie segar dengan campuran buah berry yang lezat dan menyegarkan.",
    image: "/assets/berrysm.jpg",
    label: "Sering Dibeli",
  },
  {
    id: 4,
    name: "Granola Healthy Bowl",
    category: "Bowl",
    price: 30000,
    stock: 12,
    rating: 4.7,
    reviews: 74,
    description:
      "Granola dengan bahan sehat yang cocok untuk sarapan dan menjaga energi sepanjang hari.",
    image: "/assets/granola.jpg",
    label: "Sering Dibeli",
  },
  {
    id: 5,
    name: "Banana Oatmeal",
    category: "Oatmeal",
    price: 22000,
    stock: 20,
    rating: 4.8,
    reviews: 89,
    description:
      "Oatmeal lembut dengan potongan pisang yang mengenyangkan dan cocok untuk sarapan.",
    image: "/assets/bananaoatmeal.jpg",
    label: "Sering Dibeli",
  },
  {
    id: 6,
    name: "Green Detox Juice",
    category: "Juice",
    price: 20000,
    stock: 10,
    rating: 4.6,
    reviews: 63,
    description:
      "Jus hijau segar dengan perpaduan sayuran dan buah untuk pilihan minuman yang lebih sehat.",
    image: "/assets/greendetox.jpg",
    label: "Favorit",
  },
];

const CATEGORIES = [
  "Salad",
  "Toast",
  "Smoothie",
  "Bowl",
  "Oatmeal",
  "Juice",
  "Lainnya",
];

const EMPTY_FORM = {
  name: "",
  category: "Salad",
  price: "",
  stock: "",
  description: "",
  rating: "5",
  reviews: "0",
  image: "",
  label: "",
};

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) return INITIAL_PRODUCTS;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_PRODUCTS;

    return parsed.map((item) => {
      const fallback = INITIAL_PRODUCTS.find(
        (product) => String(product.id) === String(item.id)
      );

      return {
        ...fallback,
        ...item,
        description:
          item.description ?? fallback?.description ?? "",
        rating: item.rating ?? fallback?.rating ?? 5,
        reviews: item.reviews ?? fallback?.reviews ?? 0,
        label: item.label ?? fallback?.label ?? "",
      };
    });
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState(loadProducts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFileName, setImageFileName] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(
        new Event("oursalads-products-updated")
      );
    } catch {
      setError(
        "Penyimpanan penuh. Coba gunakan gambar yang lebih kecil."
      );
    }
  }, [products]);

  const filteredProducts = products.filter((product) =>
    (product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const rupiah = (value) =>
    "Rp" + Number(value || 0).toLocaleString("id-ID");

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setImageFileName("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "Salad",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      description: product.description || "",
      rating: String(product.rating ?? 5),
      reviews: String(product.reviews ?? 0),
      image: product.image || "",
      label: product.label || "",
    });
    setImageFileName("");
    setError("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Pilih file gambar yang valid.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Ukuran gambar maksimal 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }));
      setImageFileName(file.name);
      setError("");
    };

    reader.onerror = () => {
      setError("Gambar gagal dibaca. Silakan coba lagi.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }

    if (!form.description.trim()) {
      setError("Deskripsi produk wajib diisi.");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);
    const rating = Number(form.rating);
    const reviews = Number(form.reviews);

    if (!Number.isFinite(price) || price < 0) {
      setError("Harga harus berupa angka 0 atau lebih.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stok harus berupa bilangan bulat 0 atau lebih.");
      return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setError("Rating harus antara 0 sampai 5.");
      return;
    }

    if (!Number.isInteger(reviews) || reviews < 0) {
      setError("Jumlah ulasan harus bilangan bulat 0 atau lebih.");
      return;
    }

    const updatedProduct = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      category: form.category,
      price,
      stock,
      description: form.description.trim(),
      rating,
      reviews,
      image: form.image,
      label: form.label.trim(),
    };

    if (editingId !== null) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId ? updatedProduct : product
        )
      );
      setSuccessMessage("Produk berhasil diperbarui!");
    } else {
      setProducts((previous) => [...previous, updatedProduct]);
      setSuccessMessage("Produk berhasil ditambahkan!");
    }

    setShowForm(false);
  };

  const handleDelete = () => {
    const remaining = products.filter(
      (product) => product.id !== deleteId
    );

    setProducts(remaining);
    setDeleteId(null);
    setSuccessMessage("Produk berhasil dihapus!");
  };

  return (
    <div className="space-y-6 text-[#30352F]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3F6844]">
            Manajemen Produk
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola produk, deskripsi, harga, dan stok OurSalads.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-[#5E8C61] hover:bg-[#3F6844] text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#DDE8D9] rounded-xl p-5">
          <p className="text-gray-500 text-sm">Total Produk</p>
          <p className="text-2xl font-bold text-[#3F6844] mt-2">
            {products.length}
          </p>
        </div>

        <div className="bg-white border border-[#DDE8D9] rounded-xl p-5">
          <p className="text-gray-500 text-sm">Total Stok</p>
          <p className="text-2xl font-bold text-[#3F6844] mt-2">
            {products.reduce(
              (total, product) => total + Number(product.stock || 0),
              0
            )}
          </p>
        </div>

        <div className="bg-white border border-[#DDE8D9] rounded-xl p-5">
          <p className="text-gray-500 text-sm">Stok Habis</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {products.filter(
              (product) => Number(product.stock || 0) === 0
            ).length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#DDE8D9] rounded-xl p-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama produk..."
          className="w-full sm:max-w-sm border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0]"
        />
      </div>

      <div className="bg-white border border-[#DDE8D9] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F7F4E9] text-[#3F6844]">
              <tr>
                <th className="px-4 py-4">Produk</th>
                <th className="px-4 py-4">Kategori</th>
                <th className="px-4 py-4">Harga</th>
                <th className="px-4 py-4">Stok</th>
                <th className="px-4 py-4">Rating</th>
                <th className="px-4 py-4">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#DDE8D9]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAFCF8]">
                  <td className="px-4 py-4 min-w-240px">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/assets/chickensalad.jpg"}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg bg-[#F7F4E9]"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "/assets/chickensalad.jpg";
                        }}
                      />
                      <div>
                        <p className="font-semibold text-[#3F6844]">
                          {product.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {product.description || "Belum ada deskripsi"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">{product.category}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {rupiah(product.price)}
                  </td>
                  <td className="px-4 py-4">{product.stock ?? 0}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    ⭐ {product.rating ?? 5}
                    <p className="text-gray-500 text-xs">
                      {product.reviews ?? 0} ulasan
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="px-3 py-2 rounded-lg bg-[#D3F2DA] text-[#3F6844] font-medium hover:bg-[#A8C3A0]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="px-3 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center px-4 py-10 text-gray-500"
                  >
                    Produk tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM TAMBAH / EDIT */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[#DDE8D9] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#3F6844]">
                {editingId !== null ? "Edit Produk" : "Tambah Produk"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
                aria-label="Tutup form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nama Produk *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0]"
                  placeholder="Contoh: Chicken Salad Bowl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-[#A8C3A0]"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0]"
                    placeholder="35000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Stok *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                    className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0]"
                    placeholder="20"
                  />
                </div>
              </div>

              {/* KOLOM DESKRIPSI BARU */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Deskripsi Produk *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  maxLength="1000"
                  className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0] resize-y"
                  placeholder="Jelaskan bahan, rasa, manfaat, dan informasi produk..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.description.length}/1000 karakter
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Rating (0–5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Jumlah Ulasan
                  </label>
                  <input
                    type="number"
                    name="reviews"
                    value={form.reviews}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                    className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Label Produk
                </label>
                <input
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#A8C3A0]"
                  placeholder="Contoh: Favorit (boleh dikosongkan)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Gambar Produk
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-[#DDE8D9] rounded-lg px-4 py-3 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format gambar yang didukung browser, maksimal 1 MB.
                  Kosongkan jika ingin mempertahankan gambar lama.
                </p>

                {imageFileName && (
                  <p className="text-sm text-[#3F6844] mt-2">
                    File dipilih: {imageFileName}
                  </p>
                )}

                {form.image && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">
                      Pratinjau gambar
                    </p>
                    <img
                      src={form.image}
                      alt="Pratinjau produk"
                      className="w-32 h-32 object-contain rounded-xl border border-[#DDE8D9] bg-[#F7F4E9]"
                    />
                  </div>
                )}
              </div>

              {error && (
                <p className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-[#DDE8D9] text-gray-600 py-3 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-[#5E8C61] text-white py-3 rounded-lg font-semibold hover:bg-[#3F6844]"
                >
                  {editingId !== null
                    ? "Simpan Perubahan"
                    : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KONFIRMASI HAPUS */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h2 className="text-xl font-bold text-[#3F6844]">
              Hapus Produk?
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Produk yang dihapus akan hilang dari katalog pembeli.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-[#DDE8D9] py-2.5 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PESAN BERHASIL */}
      {successMessage && (
        <div className="fixed inset-0 z-60 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#D3F2DA] flex items-center justify-center text-3xl text-[#5E8C61]">
              ✓
            </div>
            <h2 className="text-xl font-bold text-[#3F6844] mt-4">
              Berhasil!
            </h2>
            <p className="text-gray-600 mt-2">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage("")}
              className="mt-5 w-full bg-[#5E8C61] text-white py-3 rounded-lg hover:bg-[#3F6844]"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
}