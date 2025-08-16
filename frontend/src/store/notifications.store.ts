import { create } from "zustand";
import api from "../util/api";
import type { notificationSchema } from "../../../common/schema/notification.schema";
import type z from "zod";

type TNotification = z.infer<typeof notificationSchema>;

interface NotificationStore {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  notifications: TNotification[];
  isLoading: boolean;
  error: null | string;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => {
    set({ isModalOpen });
  },
  notifications: [],
  isLoading: false,
  error: null,
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/notifications/unread");

      set({ notifications: response.data.data });
    } catch (err: any) {
      console.log(err);

      if (err.status == 500) {
        set({ error: "Could not fetch notifications" });
        return;
      }

      const errorMessage =
        err?.response.data.message || "An unexpected error occurred";

      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  markNotificationAsRead: async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);

      set({
        notifications: get().notifications.filter(
          (notification: TNotification) => notification._id !== notificationId
        ),
      });
    } catch (err: any) {
      console.log(err);

      if (err.status == 500) {
        set({ error: "Could not fetch notifications" });
        return;
      }

      const errorMessage =
        err?.response.data.message || "An unexpected error occurred";

      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));

export default useNotificationStore;
