import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import useNotificationStore from "../store/notifications.store";
import { useEffect } from "react";
import { notificationSchema } from "../../../common/schema/notification.schema";
import type z from "zod";
import Notification from "./Notification";

type TNotification = z.infer<typeof notificationSchema>;

function NotificationModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    fetchNotifications,
    notifications,
    markNotificationAsRead,
    isLoading,
  } = useNotificationStore();

  useEffect(() => {
    const getNotifications = async () => {
      await fetchNotifications();
    };

    getNotifications();
  }, [fetchNotifications]);

  const onDismiss = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  return (
    <div>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Content className="absolute top-20 right-5 mt-2 w-72 rounded-md bg-white p-4 shadow-lg z-50">
            <Dialog.Title className="text-lg font-bold">
              Notifications
            </Dialog.Title>
            <Dialog.Description className="text-sm text-slate-500 my-2">
              {isLoading ? "Loading..." : ""}

              {notifications.map((notification: TNotification) => (
                <Notification
                  key={notification._id}
                  notification={notification}
                  onDismiss={() => {
                    onDismiss(notification._id);
                  }}
                />
              ))}

              {notifications.length == 0 && (
                <div>No new notifications to show</div>
              )}
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default NotificationModal;
