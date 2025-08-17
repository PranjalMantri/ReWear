import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
