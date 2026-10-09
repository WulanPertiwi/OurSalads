export default function AdminDashboard() {
const statistik = [
{
judul: "Total Penjualan",
nilai: "Rp236.000",
keterangan: "Dari seluruh pesanan contoh",
ikon: "💰",
},
{
judul: "Jumlah Pesanan",
nilai: "5",
keterangan: "Total pesanan tercatat",
ikon: "🛍️",
},
{
judul: "Total Pengguna",
nilai: "5",
keterangan: "Data pengguna contoh",
ikon: "👥",
},
];

const pesanan = [
{
id: "ORD001",
pelanggan: "Ni Kadek Wulan",
produk: "Chicken Salad Bowl",
total: "Rp35.000",
status: "Pending",
},
{
id: "ORD002",
pelanggan: "Ni Kadek Sanya",
produk: "Avocado Toast",
total: "Rp56.000",
status: "Diproses",
},
{
id: "ORD003",
pelanggan: "Indah Pertiwi",
produk: "Berry Smoothie",
total: "Rp25.000",
status: "Selesai",
},
{
id: "ORD004",
pelanggan: "Ayu Lestari",
produk: "Granola Healthy Bowl",
total: "Rp60.000",
status: "Pending",
},
{
id: "ORD005",
pelanggan: "Made Putra",
produk: "Green Detox Juice",
total: "Rp60.000",
status: "Selesai",
},
];

const warnaStatus = {
Pending: "bg-yellow-100 text-yellow-800",
Diproses: "bg-blue-100 text-blue-800",
Selesai: "bg-green-100 text-green-800",
};

return ( <div className="min-h-full space-y-6 text-[#30352F]">
{/* Header Dashboard */} <div className="rounded-2xl bg-[#3F6844] p-6 text-white shadow-sm"> <p className="mb-2 text-sm text-[#D3F2DA]">
OURSALADS ADMIN </p>

```
    <h1 className="text-3xl font-bold">
      Dashboard
    </h1>

    <p className="mt-2 text-sm text-white/85">
      Selamat datang! Kelola produk dan pantau pesanan
      makanan sehat OurSalads di sini.
    </p>
  </div>

  {/* Statistik */}
  <section>
    <h2 className="mb-4 text-xl font-bold text-[#3F6844]">
      Ringkasan Bisnis
    </h2>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statistik.map((item) => (
        <div
          key={item.judul}
          className="rounded-2xl border border-[#DDE8D9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {item.judul}
            </p>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D3F2DA] text-2xl">
              {item.ikon}
            </div>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-[#3F6844]">
            {item.nilai}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {item.keterangan}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* Statistik Status Pesanan */}
  <section>
    <h2 className="mb-4 text-xl font-bold text-[#3F6844]">
      Status Pesanan
    </h2>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        {
          judul: "Pending",
          jumlah: pesanan.filter(
            (p) => p.status === "Pending"
          ).length,
          warna: "border-yellow-400",
        },
        {
          judul: "Diproses",
          jumlah: pesanan.filter(
            (p) => p.status === "Diproses"
          ).length,
          warna: "border-blue-400",
        },
        {
          judul: "Selesai",
          jumlah: pesanan.filter(
            (p) => p.status === "Selesai"
          ).length,
          warna: "border-[#5E8C61]",
        },
      ].map((item) => (
        <div
          key={item.judul}
          className={`rounded-xl border-l-4 ${item.warna} bg-white p-5 shadow-sm`}
        >
          <p className="text-sm text-gray-500">
            Pesanan {item.judul}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#3F6844]">
            {item.jumlah}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* Pesanan Terbaru */}
  <section className="overflow-hidden rounded-2xl border border-[#DDE8D9] bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#D3F2DA] p-5">
      <div>
        <h2 className="text-xl font-bold text-[#3F6844]">
          Pesanan Terbaru
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Ringkasan pesanan pelanggan OurSalads
        </p>
      </div>

      <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3F6844]">
        {pesanan.length} Pesanan
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-650px text-left text-sm">
        <thead className="bg-[#F7F4E9] text-[#3F6844]">
          <tr>
            <th className="px-5 py-4 font-semibold">ID Pesanan</th>
            <th className="px-5 py-4 font-semibold">Pelanggan</th>
            <th className="px-5 py-4 font-semibold">Produk</th>
            <th className="px-5 py-4 font-semibold">Total</th>
            <th className="px-5 py-4 font-semibold">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#DDE8D9]">
          {pesanan.map((item) => (
            <tr
              key={item.id}
              className="transition hover:bg-[#F7FAF5]"
            >
              <td className="px-5 py-4 font-semibold text-[#3F6844]">
                {item.id}
              </td>

              <td className="px-5 py-4">
                {item.pelanggan}
              </td>

              <td className="px-5 py-4">
                {item.produk}
              </td>

              <td className="px-5 py-4 font-medium">
                {item.total}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${warnaStatus[item.status]}`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="border-t border-[#DDE8D9] bg-[#F7F4E9]/60 px-5 py-3">
      <p className="text-xs text-gray-500">
        Data pesanan contoh untuk tampilan dashboard.
      </p>
    </div>
  </section>
</div>

);
}
