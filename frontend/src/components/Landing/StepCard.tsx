interface Step {
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const StepCard: React.FC<Step> = ({
  stepNumber,
  title,
  description,
  icon: Icon,
}) => {
  return (
    <div className="relative p-8 bg-white rounded-2xl shadow-lg h-full text-center md:text-left">
      <div className="absolute -top-8 -left-4 md:translate-x-0 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
        {stepNumber}
      </div>
      <div className="mt-10 md:mt-0 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="bg-emerald-100 p-3 rounded-full">
          <Icon className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <p className="text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StepCard;

export type { Step };
