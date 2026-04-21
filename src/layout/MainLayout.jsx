import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        {/* 🔴 TOP RIGHT LOGOUT */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default MainLayout;