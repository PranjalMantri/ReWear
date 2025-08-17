import { useEffect, useState } from "react";
import useUserStore from "../store/user.store";
import profile from "../assets/profile.png";
import { Plus } from "lucide-react";
import api from "../util/api";

function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [totalItemsSwapped, setTotalItemsSwapped] = useState(0);
  const [listedItem, setListedItems] = useState(0);
  const [totalItemsListed, setTotalItemsListed] = useState(null);

  useEffect(() => {
    const getTotalItemsSwapped = async () => {
      try {
        const response = await api.get("/swap");

        setTotalItemsSwapped(response.data.data.length || 0);
      } catch (error) {
        console.log(error);
      }
    };

    const getTotalItemsListed = async () => {
      try {
        const response = await api.get("/items/me");

        setTotalItemsListed(response.data.data.length || 0);
        setListedItems(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getTotalItemsSwapped();
    getTotalItemsListed();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 text-lg">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-5 overflow-hidden">
      {/* Left side - Profile Card */}
      <div className="col-span-1 flex flex-col items-center mt-4 p-4 md:p-0 gap-10">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture || profile}
            alt="Profile"
            className="rounded-full w-36 h-36 object-cover ring-8 ring-emerald-50"
          />
          <div className="text-xl font-semibold text-gray-800 mt-2">
            {user.fullname}
          </div>
          <div className="text-sm text-gray-600">
            {"@" + user.fullname.replace(/\s/g, "").toLowerCase()}
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-2 px-6">
          <div className="border border-gray-300 py-2 rounded-sm shadow-sm w-full">
            <p className="text-center font-bold text-2xl text-gray-800">
              {user?.points}
            </p>
            <p className="text-center text-sm text-gray-600">Total Points</p>
          </div>
          <div className="flex gap-2 w-full">
            <div className="border border-gray-300 w-1/2 py-2 rounded-sm shadow-sm">
              <p className="text-center font-bold text-xl text-gray-800">
                {totalItemsListed}
              </p>
              <p className="text-center text-sm text-gray-600">Items Listed</p>
            </div>
            <div className="border border-gray-300 w-1/2 py-2 rounded-sm shadow-sm">
              <p className="text-center font-bold text-xl text-gray-800">
                {totalItemsSwapped}
              </p>
              <p className="text-center text-sm text-gray-600">Items Swapped</p>
            </div>
          </div>
        </div>

        <div className="w-full px-6 flex flex-col gap-2">
          <div
            onClick={() => setActiveTab("dashboard")}
            className="bg-white hover:bg-gray-100 px-3 py-2 border border-gray-200 rounded-sm text-base text-gray-700 cursor-pointer"
          >
            Dashboard
          </div>

          <div className="flex w-full justify-between bg-white hover:bg-gray-100 px-3 py-2 border border-gray-200 rounded-sm text-base text-gray-700 cursor-pointer">
            List an Item <Plus className="w-5 h-5 text-gray-600" />
          </div>

          <div
            onClick={() => setActiveTab("listings")}
            className="flex w-full justify-between bg-white hover:bg-gray-100 px-3 py-2 border border-gray-200 rounded-sm text-base text-gray-700 cursor-pointer"
          >
            Manage Listings
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

        <div className="mt-8">
          {activeTab == "dashboard" ? (
            <div>Dashboard</div>
          ) : (
            <div>Manage Listings</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
