import { useState } from "react";
import Header from "../components/Landing/Header";
import HeroSection from "../components/Landing/HeroSection";
import FeaturedItemsSection, {
  featuredItems,
} from "../components/Landing/FeaturedItemsSection";
import HowItWorksSection, { steps } from "../components/Landing/HowItWorks";
import FaqSection, { faqs } from "../components/Landing/FaqSection";
import CallToAction from "../components/Landing/CallToAction";
import Footer from "../components/Landing/Footer";

function Landing() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Header />
      <HeroSection />

      <main>
        <FeaturedItemsSection
          items={featuredItems}
          currentSlide={currentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          setCurrentSlide={setCurrentSlide}
        />
        <HowItWorksSection steps={steps} />
        <FaqSection faqs={faqs} />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
