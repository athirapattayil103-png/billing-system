/* MainLayout.jsx */

import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Fixed Sidebar */}
      <div className="w-52 h-screen fixed left-0 top-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-52 h-screen overflow-hidden bg-gray-100 flex flex-col">

        {/* TOP NAVBAR */}
        <div className="flex justify-between items-center bg-white px-6 py-3 shadow">
          <h1 className="font-semibold text-lg">
            Billing System
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default MainLayout;