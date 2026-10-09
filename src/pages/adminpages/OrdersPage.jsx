import { useState, useEffect } from "react";

const initialOrders = [
  { id: "ORD001", customer: "Ni Kadek Wulan", product: "Chicken Salad Bowl", quantity: 1, total: 35000, date: "08 Oktober 2026", status: "Pending" },
  { id: "ORD002", customer: "Ni Kadek Sanya", product: "Avocado Toast", quantity: 2, total: 56000, date: "08 Oktober 2026", status: "Diproses" },
  { id: "ORD003", customer: "Indah Pertiwi", product: "Berry Smoothie", quantity: 1, total: 25000, date: "07 Oktober 2026", status: "Selesai" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrders = () => {
      const saved = JSON.parse(localStorage.getItem("oursalads_orders") || "[]");
      const demo = initialOrders.map((o) => ({
        ...o,
        id: o.id,
        items: [{ name: o.product, quantity: o.quantity, price: o.total / o.quantity }],
      }));

      setOrders([...saved, ...demo]);
    };

    loadOrders();
    window.addEventListener("focus", loadOrders);
    window.addEventListener("oursalads-orders-updated", loadOrders);

    return () => {
      window.removeEventListener("focus", loadOrders);
      window.removeEventListener("oursalads-orders-updated", loadOrders);
    };
  }, []);

  const updateStatus = (id, status) => {
    const updated = orders.map((o) => o.id === id ? { ...o, status } : o);
    setOrders(updated);

    const saved = updated.filter((o) =>
      String(o.id).startsWith("ORD") === false
    );
    localStorage.setItem("oursalads_orders", JSON.stringify(saved));
    setMessage("Status pesanan berhasil diperbarui.");
  };

  const money = (n) =>
    "Rp" + Number(n || 0).toLocaleString("id-ID");

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700",
    Diproses: "bg-blue-100 text-blue-700",
    Selesai: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-[#3F6844]">
        Manajemen Pesanan
      </h1>
      <p className="mb-6 text-gray-500">Kelola pesanan pelanggan OurSalads.</p>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {["Pending", "Diproses", "Selesai"].map((status) => (
          <div key={status} className="rounded-xl bg-white p-5 shadow">
            <p className="text-gray-500">
              {status === "Pending" ? "Pesanan Pending" :
                status === "Diproses" ? "Sedang Diproses" : "Pesanan Selesai"}
            </p>
            <p className="mt-2 text-2xl font-bold">
              {orders.filter((o) => o.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {message && (
        <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
          {message}
          <button onClick={() => setMessage("")} className="float-right">✕</button>
        </p>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-[#D3F2DA]">
            <tr>
              {["ID Pesanan", "Pelanggan", "Produk", "Total", "Tanggal", "Status", "Aksi"].map((h) => (
                <th key={h} className="p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-[#3F6844]">#{o.id}</td>
                <td className="p-4">{o.customer || o.name}</td>
                <td className="p-4">
                  {(o.items || [{ name: o.product, quantity: o.quantity }])
                    .map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </td>
                <td className="p-4">{money(o.total)}</td>
                <td className="p-4">{o.date}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`rounded-full px-3 py-1 ${statusColor[o.status] || "bg-gray-100"}`}
                  >
                    <option>Pending</option>
                    <option>Diproses</option>
                    <option>Selesai</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelected(o)}
                    className="rounded-lg bg-[#D3F2DA] px-3 py-1 text-[#3F6844]"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr><td colSpan="7" className="p-8 text-center text-gray-500">
                Belum ada pesanan.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-[#3F6844]">Detail Pesanan</h2>
            <div className="space-y-3">
              <p><b>ID:</b> #{selected.id}</p>
              <p><b>Pelanggan:</b> {selected.customer || selected.name}</p>
              <p><b>Nomor HP:</b> {selected.phone || "-"}</p>
              <p><b>Alamat:</b> {selected.address || "-"}</p>
              <p><b>Produk:</b> {(selected.items || []).map((i) => `${i.name} ×${i.quantity}`).join(", ") || selected.product}</p>
              <p><b>Pembayaran:</b> {selected.payment || "-"}</p>
              <p><b>Total:</b> {money(selected.total)}</p>
              <p><b>Tanggal:</b> {selected.date}</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-6 w-full rounded-lg bg-[#3F6844] py-3 text-white">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}