import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#2e6832] text-white px-6 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="font-bold text-4xl tracking-tight"
      >
        Our Salads
      </Link>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-[#F7F4E9]">
          Dashboard
        </Link>
        <Link to="/cart" className="hover:text-[#F7F4E9]">
          Keranjang
        </Link>
        <Link to="/checkout" className="hover:text-[#F7F4E9]">
          Checkout
        </Link>
      </div>
    </nav>
  );
}