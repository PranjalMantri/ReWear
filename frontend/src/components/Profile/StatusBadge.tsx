const StatusBadge = ({ status }: { status: string }) => {
  const statusLower = status.toLowerCase();
  const styles: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    completed: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-slate-100 text-slate-800",
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
        styles[statusLower] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
