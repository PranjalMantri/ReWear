import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import useNotificationStore from "../store/notifications.store";

function NotificationModal() {
  const { isModalOpen, setIsModalOpen } = useNotificationStore();

  return (
    <div>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Content className="absolute top-20 right-5 mt-2 w-72 rounded-md bg-white p-4 shadow-lg z-50">
            <Dialog.Title className="text-lg font-bold">
              Notifications
            </Dialog.Title>
            <Dialog.Description className="text-sm text-slate-500 my-2">
              This is your notification center.
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
