import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const formatRupiah = (price) =>
    `Rp${Number(price || 0).toLocaleString("id-ID")}`;

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: (Number(item.quantity) || 1) - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => String(item.id) !== String(id)
    );

    updateCart(updatedCart);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  const shipping = cart.length > 0 ? 10000 : 0;
  const total = subtotal + shipping;

  const totalItems = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mb-4 text-7xl">🛒</div>

        <h1 className="text-2xl font-bold text-[#3F6844] sm:text-3xl">
          Keranjang Kamu Masih Kosong
        </h1>

        <p className="mt-3 text-gray-600">
          Yuk pilih makanan sehat favoritmu!
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-[#5E8C61] px-6 py-3 font-medium text-white transition hover:bg-[#3F6844]"
        >
          🥗 Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-[#5E8C61]">
          OURSALADS
        </p>

        <h1 className="text-2xl font-bold text-[#3F6844] sm:text-3xl">
          🛒 Keranjang Belanja
        </h1>

        <p className="mt-2 text-gray-600">
          Periksa kembali makanan yang ingin kamu pesan.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-[#DDE8D9] bg-white p-4 shadow-sm sm:flex-row"
            >
              <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F4E9] sm:w-32">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name || "Produk OurSalads"}
                    className="h-full w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-5xl">
                    {item.icon || "🥗"}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-sm font-medium text-[#5E8C61]">
                  {item.category || "Makanan Sehat"}
                </p>

                <h2 className="mt-1 wrap-break-words text-lg font-bold text-[#3F6844]">
                  {item.name || "Produk OurSalads"}
                </h2>

                <p className="mt-2 font-semibold text-[#3F6844]">
                  {formatRupiah(item.price)}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      Jumlah:
                    </span>

                    <div className="flex items-center overflow-hidden rounded-lg border border-[#A8C3A0]">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-9 w-9 font-bold text-[#3F6844] hover:bg-[#D3F2DA]"
                      >
                        −
                      </button>

                      <span className="w-10 text-center font-semibold text-[#3F6844]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="h-9 w-9 font-bold text-[#3F6844] hover:bg-[#D3F2DA]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="font-semibold text-[#3F6844]">
                    {formatRupiah(
                      Number(item.price) * Number(item.quantity)
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="self-start rounded-lg px-2 py-1 text-sm text-red-500 hover:bg-red-50 hover:text-red-700"
              >
                Hapus
              </button>
            </div>
          ))}

          <Link
            to="/"
            className="inline-block py-2 font-medium text-[#5E8C61] hover:text-[#3F6844]"
          >
            ← Lanjut Belanja
          </Link>
        </div>

        <div className="h-fit rounded-xl border border-[#DDE8D9] bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-xl font-bold text-[#3F6844]">
            Ringkasan Pesanan
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Rincian pembayaran belanjamu.
          </p>

          <div className="my-5 space-y-4">
            <div className="flex justify-between gap-3 text-gray-600">
              <span>Subtotal ({totalItems} item)</span>
              <span className="font-medium text-gray-800">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-gray-600">
              <span>Ongkir</span>
              <span className="font-medium text-gray-800">
                {formatRupiah(shipping)}
              </span>
            </div>
          </div>

          <div className="flex justify-between gap-3 border-t border-[#DDE8D9] pt-4">
            <span className="font-bold text-[#3F6844]">
              Total
            </span>

            <span className="text-xl font-bold text-[#3F6844]">
              {formatRupiah(total)}
            </span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-xl bg-[#5E8C61] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#3F6844]"
          >
            Lanjut ke Checkout →
          </Link>

          <div className="mt-4 rounded-lg bg-[#F7F4E9] p-3 text-center text-sm text-[#3F6844]">
            🌿 Terima kasih sudah memilih OurSalads!
          </div>
        </div>
      </div>
    </div>
  );
}