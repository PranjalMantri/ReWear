import { useEffect, useState } from "react";
import useUserStore from "../store/user.store";

import { Boxes, LayoutDashboard, LogOut, Plus, PlusSquare } from "lucide-react";
import useSwapStore from "../store/swap.store";
import { useShallow } from "zustand/react/shallow";
import Dashboard from "../components/Profile/Dashboard";
import UserListings from "../components/Profile/UserListings";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../components/UserAvatar";

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userPoints, setUserPoints] = useState<number>();

  const user = useUserStore(useShallow((state) => state.user));
  const userItems = useUserStore(useShallow((state) => state.userItems));
  const fetchUserItems = useUserStore(
    useShallow((state) => state.fetchUserItems)
  );
  const getUserPoints = useUserStore(
    useShallow((state) => state.getUserPoints)
  );
  const logout = useUserStore(useShallow((state) => state.logout));

  const getSwaps = useSwapStore(useShallow((state) => state.getSwaps));
  const swaps = useSwapStore(useShallow((state) => state.swaps));

  useEffect(() => {
    fetchUserItems();
    getSwaps();

    const fetchPoints = async () => {
      const points = await getUserPoints();
      setUserPoints(points);
    };

    fetchPoints();
  }, [fetchUserItems, getSwaps]);

  const handleLogout = async () => {
    await logout();
    useUserStore.getState().setIsUserLoggedIn(false);
    navigate("/", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 text-lg">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-5">
      {/* Left side - Profile Card */}
      <div className="col-span-1 flex flex-col items-center mt-4 p-4 md:p-0 gap-6">
        <UserAvatar />
        <div className="w-full flex flex-col items-center gap-2 px-6">
          <div className="border border-gray-300 py-2 rounded-sm shadow-sm w-full">
            <p className="text-center font-bold text-2xl text-gray-800">
              {userPoints}
            </p>
            <p className="text-center text-sm text-gray-600">Total Points</p>
          </div>
          <div className="flex gap-2 w-full">
            <div className="border border-gray-300 w-1/2 py-2 rounded-sm shadow-sm">
              <p className="text-center font-bold text-xl text-gray-800">
                {userItems.length}
              </p>
              <p className="text-center text-sm text-gray-600">Items Listed</p>
            </div>
            <div className="border border-gray-300 w-1/2 py-2 rounded-sm shadow-sm">
              <p className="text-center font-bold text-xl text-gray-800">
                {swaps.length}
              </p>
              <p className="text-center text-sm text-gray-600">Items Swapped</p>
            </div>
          </div>
        </div>

        <div className="w-full px-6 flex flex-col gap-2">
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex w-full items-center gap-2 bg-white hover:bg-gray-100 px-3 py-2 border border-gray-200 rounded-sm text-base text-gray-700 cursor-pointer"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-600" />
            Dashboard
          </div>

          <div
            onClick={() => {
              navigate("/list-item");
            }}
            className="flex w-full items-center justify-between bg-white hover:bg-gray-100 px-3 py-2 border border-gray-200 rounded-sm text-base text-gray-700 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PlusSquare className="w-5 h-5 text-gray-600" />
              List an Item
            </div>
            <Plus className="w-5 h-5 text-gray-600" />
          </div>

          <div
            onClick={() => setActiveTab("listings")}
            className="flex w-full items-center gap-2 bg-white hover:bg-gray-100 px-3 py-2 border border-gray-200 rounded-sm text-base text-gray-700 cursor-pointer"
          >
            <Boxes className="w-5 h-5 text-gray-600" />
            Manage Listings
          </div>

          <div
            onClick={() => handleLogout()}
            className="flex w-full items-center gap-2 bg-white hover:bg-gray-100 px-3 py-2 border border-gray-200 rounded-sm text-base text-gray-700 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
            Logout
          </div>
        </div>
      </div>

      {/* Right side - Main Content */}
      <div className="col-span-1 md:col-span-4 p-8">
        <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>

        <div className="mt-6 border-b border-gray-200">
          <nav className="flex gap-8 -mb-px">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 text-lg font-medium ${
                activeTab === "dashboard"
                  ? "border-b-2 border-emerald-500 text-emerald-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`py-4 px-1 text-lg font-medium ${
                activeTab === "listings"
                  ? "border-b-2 border-emerald-500 text-emerald-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Manage Listings
            </button>
          </nav>
        </div>

        <div>
          {activeTab == "dashboard" ? (
            <Dashboard />
          ) : (
            <UserListings items={userItems} isLoading={false} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
