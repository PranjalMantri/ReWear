import { Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer className="bg-slate-800 text-slate-300">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
            Platform
          </h3>
          <ul className="mt-4 space-y-4">
            <li>
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <Link to="/browse" className="hover:text-white transition-colors">
                Browse Items
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-slate-700 pt-8 md:flex md:items-center md:justify-between">
        <div className="flex space-x-6 md:order-2">
          <a
            target="_"
            href="https://x.com/pranjalmantri"
            className="hover:text-white"
          >
            <Twitter className="h-6 w-6" />
          </a>
          <a
            target="_"
            href="https://github.com/PranjalMantri"
            className="hover:text-white"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-8 text-base md:mt-0 md:order-1">
          &copy; {new Date().getFullYear()} Developed by Pranjal Mantri
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
