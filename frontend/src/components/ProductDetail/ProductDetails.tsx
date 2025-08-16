import type z from "zod";
import type { itemSchema } from "../../../../common/schema/item.schema";
import useRedeemStore from "../../store/redeem.store";
import { useEffect, useState } from "react";
import useUserStore from "../../store/user.store";
import useSwapStore from "../../store/swap.store";
import SwapModal from "./SwapModal";

type Item = z.infer<typeof itemSchema>;

interface ProductDetailsProps {
  item: Item;
}

const ProductDetails = ({ item }: ProductDetailsProps) => {
  const [itemRedeemed, setItemRedeemed] = useState(false);
  const [redeemedByCurrentUser, setRedeemedByCurrentUser] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [itemSwapped, setItemSwapped] = useState(false);
  const [swappedByCurrentUser, setSwappedByCurrentUser] = useState(false);
  // const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedSwapItem, setSelectedSwapItem] = useState<any>();

  const { isSwapModalOpen, setIsSwapModalOpen } = useSwapStore();

  const {
    isLoading: redemptionLoading,
    error: redemptionError,
    redeemItem,
    redemptionSuccessful,
    getItemStatus: getRedemptionStatus,
    resetRedemptionState,
  } = useRedeemStore();

  const {
    isLoading: swapLoading,
    error: swapError,
    swapSuccessful,
    getItemStatus: getSwapStatus,
    resetSwapState,
  } = useSwapStore();

  const { user } = useUserStore();

  useEffect(() => {
    const checkItemStatus = async () => {
      setStatusLoading(true);
      try {
        if (item.listingType === "redeem") {
          const response = await getRedemptionStatus(item._id);
          if (response.itemRedeemed) {
            setItemRedeemed(true);
            if (response.redeemer === (user as any)._id) {
              setRedeemedByCurrentUser(true);
            }
          }
        } else if (item.listingType === "swap") {
          const response = await getSwapStatus(item._id);
          console.log(response);
          if (response.itemSwapped) {
            setItemSwapped(true);
            if (response.proposer === (user as any)._id) {
              setSwappedByCurrentUser(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to get item status:", error);
      } finally {
        setStatusLoading(false);
      }
    };

    resetRedemptionState();
    resetSwapState();

    checkItemStatus();
  }, [item, user, getRedemptionStatus, getSwapStatus]);

  const isActionDisabled =
    redemptionLoading ||
    redemptionSuccessful ||
    itemRedeemed ||
    statusLoading ||
    swapLoading ||
    swapSuccessful ||
    itemSwapped;

  const handleAction = async () => {
    if (item.listingType === "redeem") {
      await redeemItem(item._id);
    } else if (item.listingType === "swap") {
      setIsSwapModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`max-w-2xl min-w-md mx-auto p-6 bg-white rounded-xl transition-all duration-300 ${
          isSwapModalOpen ? "opacity-50" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {item.title}
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">{item.description}</p>

        <div className="mt-6 bg-gray-50 rounded-lg p-4 divide-y divide-gray-200">
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">Brand</span>
            <span className="font-medium text-gray-800">{item.brand}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">Size</span>
            <span className="font-medium text-gray-800">
              {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">Condition</span>
            <span className="font-medium text-gray-800">
              {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
            </span>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          {item.listingType === "redeem" && (
            <>
              <h3 className="font-semibold text-lg text-gray-900">
                Redeem with Points
              </h3>
              {statusLoading ? (
                <p className="mt-2 text-sm text-gray-600">
                  Checking item status...
                </p>
              ) : redeemedByCurrentUser ? (
                <div className="flex items-center space-x-2 text-emerald-600 mt-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm">
                    You have already redeemed this item. <br />
                    Check your profile for updates.
                  </p>
                </div>
              ) : itemRedeemed ? (
                <p className="mt-2 text-sm text-red-600">
                  This item has already been redeemed by another user.
                </p>
              ) : redemptionSuccessful ? (
                <div className="flex items-center space-x-2 text-emerald-600 mt-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm">
                    Congratulations! You've successfully redeemed this item.{" "}
                    <br />
                    Check out the profile page for item related updates.
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-gray-600">
                    Use your accumulated points to redeem this item instantly.
                  </p>
                  <button
                    disabled={isActionDisabled}
                    onClick={handleAction}
                    className="mt-5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {redemptionLoading
                      ? "Redeeming..."
                      : `Redeem (${item.price} Points)`}
                  </button>
                  {redemptionError && (
                    <p className="mt-2 text-sm text-red-600">
                      {redemptionError}
                    </p>
                  )}
                </>
              )}
            </>
          )}

          {item.listingType === "swap" && (
            <>
              <h3 className="font-semibold text-lg text-gray-900">Swap Item</h3>
              {statusLoading ? (
                <p className="mt-2 text-sm text-gray-600">
                  Checking item status...
                </p>
              ) : swappedByCurrentUser ? (
                <div className="flex items-center space-x-2 text-emerald-600 mt-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm">
                    You have already swapped this item. <br />
                    Check your profile for updates.
                  </p>
                </div>
              ) : itemSwapped ? (
                <p className="mt-2 text-sm text-red-600">
                  This item has already been swapped by another user.
                </p>
              ) : swapSuccessful ? (
                <div className="flex items-center space-x-2 text-emerald-600 mt-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm">
                    Congratulations! You've successfully swapped this item.{" "}
                    <br />
                    Check out the profile page for item related updates.
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-gray-600">
                    Swap this item with one of your own items.
                  </p>
                  <button
                    disabled={isActionDisabled}
                    onClick={handleAction}
                    className="mt-5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {swapLoading ? "Offering a swap..." : `Offer a swap`}
                  </button>
                  {swapError && (
                    <p className="mt-2 text-sm text-red-600">{swapError}</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isSwapModalOpen && (
        <SwapModal
          selectedSwapItem={selectedSwapItem}
          setSelectedSwapItem={setSelectedSwapItem}
        />
      )}
    </>
  );
};

export default ProductDetails;
