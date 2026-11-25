
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#193D57] px-5 py-8 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10ADA0] text-white">
            <ShieldCheck size={27} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-white">
            Triage<span className="text-[#10ADA0]">Sync</span>
          </span>
        </Link>

        {/* Footer Description */}
        <p className="text-center text-sm text-blue-100">
          Making complaint management simpler, faster, and transparent.
        </p>

        {/* Copyright */}
        <p className="text-center text-sm text-blue-100">
          © {new Date().getFullYear()} TriageSync. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;

