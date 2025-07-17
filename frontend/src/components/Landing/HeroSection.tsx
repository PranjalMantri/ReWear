import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center bg-emerald-100 text-emerald-800 rounded-full px-4 py-2 text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4 mr-2" />
          The Sustainable Fashion Revolution
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Swap, Share,
          </span>
          <br />
          And Restyle Your Wardrobe
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join thousands of fashion lovers exchanging pre-loved clothing.
          Refresh your wardrobe, reduce textile waste, and embrace a more
          sustainable future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup">
            <button className="group w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
