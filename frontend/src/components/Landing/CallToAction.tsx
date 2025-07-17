import { Shirt } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-emerald-600 to-teal-600">
      <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Wardrobe
        </h2>
        <p className="text-xl text-emerald-100 mb-10 leading-relaxed max-w-3xl mx-auto">
          Join for free, list your first item in minutes, and discover a whole
          new way to love your clothes.
        </p>
        <Link to="/home">
          <button className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto">
            <Shirt className="mr-2 h-5 w-5" />
            Start Swapping Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
