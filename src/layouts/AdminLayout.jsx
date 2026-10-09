import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <div className="md:hidden bg-white shadow p-4 flex justify-between">
          <h1 className="font-bold">OurSalads Admin</h1>

          <button
            className="p-2 border rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        <footer className="bg-white border-t p-4 text-center text-sm">
          © 2026 OurSalads Admin
        </footer>
      </div>
    </div>
  );
}