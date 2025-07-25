import { Bell, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => (
  <header className="w-full z-50 border-b border-b-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm">
    <div className="flex justify-between items-center py-6 px-4 sm:px-10">
      <div className="flex items-baseline gap-8">
        <Link
          to={"/"}
          className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
        >
          ReWear
        </Link>
        <nav className="hidden flex-1 md:flex justify-center space-x-10">
          <Link
            to={"/redeem"}
            className="text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Redeem
          </Link>
          <Link
            to={"/swap"}
            className="text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Swap
          </Link>
          <Link
            to={"/donate"}
            className="text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Donate
          </Link>
        </nav>
      </div>
      <div className="flex gap-8">
        <div className="relative hidden sm:flex sm:item-center rounded-xl px-3 bg-emerald-50 border border-slate-200 hover:border-slate-300">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700/60 w-5 h-5" />
          <input
            className="pl-10 pr-4 py-2 bg-emerald-50 text-sm px-2 outline-none text-slate-800 placeholder:text-emerald-700 "
            placeholder="Search"
            type="text"
            name="Search"
          />
        </div>

        <div className="relative hidden px-2 py-2 sm:flex items-center bg-emerald-50 border border-slate-200 rounded-xl hover:border-slate-300">
          <Bell className="text-slate-800 w-5 h-5" />
        </div>

        <Link
          className="w-10 h-10 rounded-full ring-2 ring-emerald-400"
          to={`/profile`}
        >
          <img
            src={"https://avatar.iran.liara.run/public/1"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
      </div>
    </div>
  </header>
);

export default Navbar;
