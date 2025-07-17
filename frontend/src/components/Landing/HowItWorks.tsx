import { Smartphone, RefreshCw, Sparkles } from "lucide-react";
import type { Step } from "./StepCard";
import StepCard from "./StepCard";

const steps: Step[] = [
  {
    stepNumber: "01",
    title: "List Your Items",
    description:
      "Upload photos and details of clothing you no longer wear. Every item earns you points!",
    icon: Smartphone,
  },
  {
    stepNumber: "02",
    title: "Browse & Swap",
    description:
      "Discover amazing pieces from other members. Request swaps or use your points to claim items.",
    icon: RefreshCw,
  },
  {
    stepNumber: "03",
    title: "Refresh Your Wardrobe",
    description:
      "Receive new-to-you items and give your old favorites a new home. Everyone wins!",
    icon: Sparkles,
  },
];

interface HowItWorksSectionProps {
  steps: Step[];
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Join our community and start your sustainable fashion journey today.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-y-12 md:gap-x-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2">
            <svg width="100%" height="100%">
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                strokeDasharray="8 8"
                className="stroke-slate-300"
                strokeWidth="2"
              />
            </svg>
          </div>
          {steps.map((step, index) => (
            <div key={index}>
              <StepCard {...step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
export { steps };
