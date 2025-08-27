import type z from "zod";
import type { itemSchema } from "../../../../common/schema/item.schema";
import useSwapStore from "../../store/swap.store";
import { useEffect } from "react";
import useUserStore from "../../store/user.store";
import { useParams } from "react-router-dom";
import useItemStore from "../../store/item.store";

import ItemCard from "../Home/ItemCard";

type Item = z.infer<typeof itemSchema>;

interface SwapModalProps {
  selectedSwapItem: Item | null;
  setSelectedSwapItem: (item: Item | null) => void;
}

const SwapModal = ({
  selectedSwapItem,
  setSelectedSwapItem,
}: SwapModalProps) => {
  const {
    isLoading: swapLoading,
    isSwapModalOpen,
    setIsSwapModalOpen,
    proposeSwap,
  } = useSwapStore();

  const { userItems, fetchUserItems } = useUserStore();

  const { itemId: proposedItemId } = useParams();
  const { item } = useItemStore();

  useEffect(() => {
    const getUserItems = async () => {
      await fetchUserItems();
    };

    if (isSwapModalOpen) {
      getUserItems();
    }
  }, [isSwapModalOpen, fetchUserItems]);

  if (!isSwapModalOpen) return null;

  const handleSwap = (itemId: string) => {
    const userId = (item as any)?.userId;

    if (!proposedItemId) return;

    if (!userId) return;

    proposeSwap(proposedItemId, userId, itemId);
    setIsSwapModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-opacity-75 transition-opacity"
        onClick={() => setIsSwapModalOpen(false)}
      ></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full z-10 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Select an item to swap</h2>
          <p className="text-sm text-gray-600 mb-6">
            Choose an item from your wardrobe to offer for this exchange.
          </p>

          {userItems && userItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 max-h-60 overflow-y-auto">
                {userItems.map((userItem: any) => (
                  <div
                    key={userItem._id}
                    onClick={() => setSelectedSwapItem(userItem)}
                    className={`relative cursor-pointer ${
                      selectedSwapItem?._id === userItem._id
                        ? "ring-2 ring-emerald-500"
                        : ""
                    }`}
                  >
                    <ItemCard {...userItem} />
                    {selectedSwapItem?._id === userItem._id && (
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsSwapModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedSwapItem || swapLoading}
                  onClick={() => {
                    // This now correctly passes the _id of the selected item
                    if (selectedSwapItem) {
                      handleSwap(selectedSwapItem._id);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {swapLoading ? "Swapping..." : "Swap Item"}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div>User does not have any items to swap</div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsSwapModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedSwapItem || swapLoading}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {swapLoading ? "Swapping..." : "Swap Item"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
