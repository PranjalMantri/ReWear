interface DividerProps {
  children: string;
}

const Divider: React.FC<DividerProps> = ({ children }) => {
  return (
    <div className="flex items-center">
      <div className="flex-grow border-t border-slate-400"></div>
      <span className="mx-4">{children}</span>
      <div className="flex-grow border-t border-slate-400"></div>
    </div>
  );
};

export default Divider;
