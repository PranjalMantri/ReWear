import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <header className="w-full z-50 border-b-2 border-b-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm">
    <div className="flex justify-between items-center py-7 px-4 sm:px-10">
      <div>
        <Link to={"/"}>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ReWear
          </span>
        </Link>
      </div>
      <nav className="hidden flex-1 md:flex justify-center space-x-10">
        <a
          href="#how-it-works"
          className="text-slate-600 hover:text-emerald-600 transition-colors"
        >
          How it Works
        </a>
        <a
          href="#faq"
          className="text-slate-600 hover:text-emerald-600 transition-colors"
        >
          FAQ
        </a>
      </nav>
      <div>
        <Link to={"/signup"}>
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-6 py-2 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
            Join Now
          </button>
        </Link>
      </div>
    </div>
  </header>
);

export default Header;
