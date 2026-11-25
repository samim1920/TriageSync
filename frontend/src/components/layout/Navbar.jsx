
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Progress", path: "/progress" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "SOS", path: "/sos" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#193D57] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10ADA0] text-white">
            <ShieldCheck size={27} />
          </div>

          <span className="text-2xl font-extrabold text-white">
            Triage<span className="text-[#10ADA0]">Sync</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold transition hover:text-[#10ADA0] ${
                location.pathname === link.path
                  ? "text-[#10ADA0]"
                  : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-xl border border-white/40 px-5 py-3 font-bold text-white transition hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#10ADA0] px-5 py-3 font-bold text-white transition hover:bg-[#0D978C]"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#193D57] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-5">

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`font-semibold ${
                  location.pathname === link.path
                    ? "text-[#10ADA0]"
                    : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-white/20" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-xl border border-white/40 px-5 py-3 text-center font-bold text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-xl bg-[#10ADA0] px-5 py-3 text-center font-bold text-white"
            >
              Register a Complaint
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

