import { XCircle, Bell } from "lucide-react";
import { z } from "zod";
import { notificationSchema } from "../../../common/schema/notification.schema";

type TNotification = z.infer<typeof notificationSchema>;

interface NotificationProps {
  notification: TNotification;
  onDismiss: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  notification,
  onDismiss,
}) => {
  return (
    <div className="flex items-start gap-4 p-4 m-1 border border-slate-200 bg-white shadow-sm rounded-lg">
      <div className="flex-shrink-0 pt-1">
        <Bell className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-800 text-sm">
          {notification.message || "Notification"}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;
