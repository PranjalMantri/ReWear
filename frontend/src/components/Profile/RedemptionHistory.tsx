import type z from "zod";
import type { redemptionSchema } from "../../../../common/schema/redemption.schema";
import StatusBadge from "./StatusBadge";

type Redemption = z.infer<typeof redemptionSchema>;

const RedemptionActions = ({
  redemption,
  currentUserId,
}: {
  redemption: Redemption;
  currentUserId: string;
}) => {
  if (redemption.status === "completed" || redemption.status === "cancelled") {
    return <span className="text-gray-400">-</span>;
  }

  if (redemption.status === "pending") {
    const isRedeemer = currentUserId === redemption.userId?._id;
    const isItemOwner = currentUserId === redemption.itemId?.userId;

    if (isRedeemer) {
      if (redemption.confirmedBySender) {
        return (
          <button
            onClick={() =>
              console.log(`Marking as received: ${redemption._id}`)
            }
            className="px-4 py-1.5 text-sm font-semibold text-green-600 bg-green-100 rounded-lg hover:bg-green-200"
          >
            Mark as Received
          </button>
        );
      } else {
        return (
          <button
            onClick={() =>
              console.log(`Canceling redemption: ${redemption._id}`)
            }
            className="px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
          >
            Cancel
          </button>
        );
      }
    }

    if (isItemOwner && !redemption.confirmedBySender) {
      return (
        <button
          onClick={() => console.log(`Marking as shipped: ${redemption._id}`)}
          className="px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
        >
          Mark as Shipped
        </button>
      );
    }
  }

  return null;
};

const RedemptionHistory = ({
  redemptions,
  currentUserId,
}: {
  redemptions: Redemption[];
  currentUserId: string;
}) => {
  return (
    <div className="bg-white font-sans w-full rounded-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-4 pt-4 sm:px-6 sm:pt-6">
        Redemption History
      </h2>

      <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-gray-500 px-4 pb-3 border-b border-gray-200">
        <div className="col-span-5">Item</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      <div className="divide-y divide-gray-100">
        {redemptions.map((redemption) => {
          // Fallback if itemId is a string instead of an object
          const redeemedItem =
            typeof redemption.itemId === "string"
              ? { _id: redemption.itemId, title: "Item" }
              : redemption.itemId;

          return (
            <div
              key={redemption._id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-4 py-5"
            >
              <div className="col-span-12 sm:col-span-5 flex flex-col">
                <div className="font-semibold text-gray-800">
                  {redeemedItem?.title}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-2 text-gray-600">
                {new Date(redemption.createdAt).toLocaleDateString()}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <StatusBadge status={redemption.status} />
              </div>
              <div className="col-span-12 sm:col-span-3 flex justify-end">
                <RedemptionActions
                  redemption={redemption}
                  currentUserId={currentUserId}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RedemptionHistory;
