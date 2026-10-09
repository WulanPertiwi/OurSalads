import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "COD",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shipping = cart.length ? 10000 : 0;
  const total = subtotal + shipping;

  const rupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);

  const handleOrder = (e) => {
    e.preventDefault();

    if (!cart.length) {
      setError("Keranjang belanja kamu masih kosong.");
      return;
    }

    const order = {
      id: Date.now(),
      customer: form.name,
      phone: form.phone,
      address: form.address,
      payment: form.payment,
      items: cart,
      subtotal,
      shipping,
      total,
      status: "Pending",
      date: new Date().toLocaleString("id-ID"),
    };

    const orders = JSON.parse(
      localStorage.getItem("oursalads_orders") || "[]"
    );

    localStorage.setItem(
      "oursalads_orders",
      JSON.stringify([order, ...orders])
    );
    localStorage.removeItem("cart");

    setSuccess(true);
  };

  if (!cart.length && !success) {
    return (
      <div className="min-h-screen bg-[#F7F4E9] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-[#3F6844]">
          Keranjang Kosong
        </h2>
        <p className="my-3 text-gray-600">
          Tambahkan produk sebelum melakukan checkout.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-[#3F6844] px-6 py-3 text-white"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4E9] px-4 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/cart" className="text-[#3F6844]">
          ← Kembali ke Keranjang
        </Link>

        <h1 className="my-6 text-3xl font-bold text-[#3F6844]">
          Checkout
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <form
            onSubmit={handleOrder}
            className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold">Informasi Pengiriman</h2>

            {[
              { key: "name", label: "Nama Lengkap", type: "text" },
              { key: "phone", label: "Nomor HP", type: "tel" },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium">
                  {field.label}
                </label>
                <input
                  required
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-[#5E8C61]"
                />
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Alamat Pengiriman
              </label>
              <textarea
                required
                rows="3"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="w-full rounded-xl border p-3 outline-none focus:border-[#5E8C61]"
              />
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Metode Pembayaran</h3>
              {["COD", "Transfer Bank", "E-Wallet"].map((method) => (
                <label
                  key={method}
                  className="mb-2 flex cursor-pointer items-center gap-3 rounded-xl border p-3"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={form.payment === method}
                    onChange={(e) =>
                      setForm({ ...form, payment: e.target.value })
                    }
                  />
                  {method}
                </label>
              ))}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#3F6844] py-3 font-semibold text-white hover:bg-[#2e6832]"
            >
              Buat Pesanan · {rupiah(total)}
            </button>
          </form>

          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">Ringkasan Pesanan</h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {rupiah(Number(item.price))}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {rupiah(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-5" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{rupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>{rupiah(shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-bold text-[#3F6844]">
                <span>Total</span>
                <span>{rupiah(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl">
            <div className="mb-3 text-5xl text-[#5E8C61]">✓</div>
            <h2 className="text-2xl font-bold text-[#3F6844]">
              Pesanan Berhasil!
            </h2>
            <p className="my-3 text-gray-600">
              Terima kasih, {form.name}. Pesanan kamu berhasil dibuat.
            </p>
            <p className="mb-5 font-semibold">
              Total: {rupiah(total)}
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-xl bg-[#3F6844] py-3 text-white"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}