import { Link } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <div
      className={`${
        sidebarOpen ? "block" : "hidden"
      } md:block w-64 bg-[#c5e4be] shadow-md`}
    >
      {/* LOGO / JUDUL */}
      <div className="p-4 font-bold text-xl text-[#3F6844]">
        🥗 OurSalads Admin
      </div>

      {/* MENU */}
      <nav className="flex flex-col p-4 space-y-2">

        {/* DASHBOARD */}
        <Link
          to="/admin/dashboard"
          className="hover:bg-[#D3F2DA] p-2 rounded"
        >
          Dashboard
        </Link>

        {/* PRODUK */}
        <Link
          to="/admin/products"
          className="hover:bg-[#D3F2DA] p-2 rounded"
        >
          Produk
        </Link>

        {/* PESANAN */}
        <Link
          to="/admin/orders"
          className="hover:bg-[#D3F2DA] p-2 rounded"
        >
          Pesanan
        </Link>

        {/* ABOUT */}
        <Link
          to="/admin/about"
          className="hover:bg-[#D3F2DA] p-2 rounded"
        >
          About
        </Link>

      </nav>
    </div>
  );
}