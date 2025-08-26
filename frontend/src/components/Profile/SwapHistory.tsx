import type z from "zod";
import type { swapSchema } from "../../../../common/schema/swap.schema";
import StatusBadge from "./StatusBadge";
import useSwapStore from "../../store/swap.store";

type Swap = z.infer<typeof swapSchema>;

const SwapActions = ({
  swap,
  currentUserId,
}: {
  swap: Swap;
  currentUserId: string;
}) => {
  const { acceptSwap, rejectSwap, cancelSwap, completeSwap } = useSwapStore();

  const handleAccept = async (swapId: string) => {
    await acceptSwap(swapId);
  };

  const handleReject = async (swapId: string) => {
    await rejectSwap(swapId);
  };

  const handleCancel = async (swapId: string) => {
    await cancelSwap(swapId);
  };

  const handleMarkCompleted = async (swapId: string) => {
    await completeSwap(swapId);
  };

  if (swap.status === "pending") {
    if (swap.receiver?._id === currentUserId) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleAccept(swap._id)}
            className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
          >
            Accept
          </button>
          <button
            onClick={() => handleReject(swap._id)}
            className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Reject
          </button>
        </div>
      );
    }

    // proposer can cancel while pending
    if (swap.proposer?._id === currentUserId) {
      return (
        <button
          onClick={() => handleCancel(swap._id)}
          className="px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
        >
          Cancel
        </button>
      );
    }
  }

  // ACCEPTED — both sides can mark completion
  if (swap.status === "accepted") {
    const isProposer = swap.proposer?._id === currentUserId;
    const isReceiver = swap.receiver?._id === currentUserId;

    const alreadyCompleted = isProposer
      ? swap.proposerCompleted
      : swap.receiverCompleted;

    // ✅ case: both sides marked as completed
    if (swap.proposerCompleted && swap.receiverCompleted) {
      return (
        <span className="text-sm font-medium text-green-600">
          ✅ Swap completed successfully!
        </span>
      );
    }

    if ((isProposer || isReceiver) && !alreadyCompleted) {
      return (
        <button
          onClick={() => handleMarkCompleted(swap._id)}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Mark as Completed
        </button>
      );
    }

    return (
      <span className="text-sm text-gray-500">
        Waiting for other user to complete the swap
      </span>
    );
  }

  // COMPLETED / REJECTED / CANCELLED
  if (
    swap.status === "completed" ||
    swap.status === "rejected" ||
    swap.status === "cancelled"
  ) {
    return <span className="text-gray-400">-</span>;
  }

  return null;
};

const SwapHistory = ({
  swaps,
  currentUserId,
}: {
  swaps: Swap[];
  currentUserId: string;
}) => {
  return (
    <div className="bg-white font-sans w-full rounded-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-4 pt-4 sm:px-6 sm:pt-6">
        Swap History
      </h2>

      <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-gray-500 px-4 pb-3 border-b border-gray-200">
        <div className="col-span-5">Items</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      <div className="divide-y divide-gray-100">
        {swaps.map((swap) => {
          const isProposer = swap.proposer?._id === currentUserId;

          const proposed =
            typeof swap.proposedItemId === "string"
              ? { _id: swap.proposedItemId, title: swap.proposedItemId }
              : swap.proposedItemId;

          const received =
            typeof swap.receivedItemId === "string" ||
            swap.receivedItemId == null
              ? {
                  _id: String(swap.receivedItemId ?? ""),
                  title: String(swap.receivedItemId ?? ""),
                }
              : swap.receivedItemId;

          const myItem = isProposer ? proposed : received;
          const theirItem = isProposer ? received : proposed;

          return (
            <div
              key={swap._id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-4 py-5"
            >
              <div className="col-span-12 sm:col-span-5 flex flex-col">
                <div className="font-semibold text-gray-800">
                  {myItem.title}
                </div>
                <div className="text-sm text-gray-500">
                  for {theirItem.title}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-2 text-gray-600">
                {new Date(swap.createdAt).toLocaleDateString()}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <StatusBadge status={swap.status} />
              </div>
              <div className="col-span-12 sm:col-span-3 flex justify-end">
                <SwapActions swap={swap} currentUserId={currentUserId} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SwapHistory;
