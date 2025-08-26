import { useEffect, useState } from "react";
import useUserStore from "../../store/user.store";
import useRedeemStore from "../../store/redeem.store";
import useSwapStore from "../../store/swap.store";
import RedemptionHistory from "./RedemptionHistory";
import SwapHistory from "./SwapHistory";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"Swap" | "Redemption">("Swap");
  const { user } = useUserStore();

  if (!user?._id) {
    return;
  }

  const currentUserId = user?._id;
  const { swaps, getSwaps } = useSwapStore();
  const { redemptions, getRedemptions } = useRedeemStore();

  useEffect(() => {
    getSwaps();

    getRedemptions();
  }, []);

  return (
    <div className="bg-white font-sans w-full max-w-5xl mx-auto my-8 p-4 sm:p-6 rounded-2xl">
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200">
          {(["Swap", "Redemption"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-base font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-emerald-500 text-emerald-500"
                  : "text-gray-500 hover:text-emerald-500"
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Swap" && (
        <SwapHistory swaps={swaps} currentUserId={currentUserId} />
      )}

      {activeTab === "Redemption" && (
        <RedemptionHistory
          redemptions={redemptions}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default Dashboard;
