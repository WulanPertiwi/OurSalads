import { useProductFilter } from "../context/ProductFilterContext";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const { search, setSearch, category, setCategory } = useProductFilter();

  return (
    <div className="flex flex-col min-h-screen bg-[#d3f2da]">
      <Navbar />

     <header className="bg-[#7daf82] p-4 flex flex-col md:flex-row gap-2 justify-between items-center">
        <input
          type="text"
          placeholder="Cari makanan sehat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-[#A8C3A0] rounded-lg placeholder:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#f8fcf8]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-[#A8C3A0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f8fcf8]"
        >
          <option>Semua Kategori</option>
          <option>Salad</option>
          <option>Toast</option>
          <option>Smoothie</option>
          <option>Bowl</option>
          <option>Oatmeal</option>
          <option>Juice</option>
        </select>
      </header>

      <main className="flex-1 p-6">
        <Outlet context={{ search, category }} />
      </main>

      <footer className="bg-[#3F6844] text-white text-center p-4">
        <p>© 2026 OurSalads | Healthy Food</p>
      </footer>
    </div>
  );
}