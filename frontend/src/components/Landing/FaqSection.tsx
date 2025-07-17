import FaqItem from "./FaqItem";
import type { FAQ } from "./FaqItem";

const faqs: FAQ[] = [
  {
    question: "How does shipping work?",
    answer:
      "Both users agree to a swap, then each is responsible for shipping their own item. We provide suggestions for low-cost, eco-friendly packaging and shipping options in your user dashboard.",
  },
  {
    question: "How are points calculated?",
    answer:
      "Points are calculated based on the item's original value, brand, condition, and category. Our system suggests a point value when you list, which you can adjust.",
  },
  {
    question: "What if an item isn't as described?",
    answer:
      "We have a dispute resolution process. If an item is significantly different from its description, you can report it to us within 48 hours of receipt, and our support team will mediate.",
  },
  {
    question: "Is there a fee to use ReWear?",
    answer:
      "Listing and swapping items is free! We take a small percentage of points transactions to cover platform maintenance and support services. There are no hidden subscription fees.",
  },
];

interface FaqSectionProps {
  faqs: FAQ[];
}

const FaqSection: React.FC<FaqSectionProps> = () => {
  return (
    <section id="faq" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Have questions? We've got answers. If you can't find what you're
            looking for, feel free to contact us.
          </p>
        </div>
        <div>
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
export { faqs };
