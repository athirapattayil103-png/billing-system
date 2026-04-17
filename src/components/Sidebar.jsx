


import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-gray-900 text-white p-4">

      <h2 className="text-xl font-bold mb-6">Billing App</h2>

      <ul className="space-y-3">

        <li>
          <NavLink
            to="/app/dashboard"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/products"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Products
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/purchase"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Purchase
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/sales"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Sales
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/expenses"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Expenses
          </NavLink>
        </li>
        <li>
  <NavLink
    to="/app/sales-return"
    className={({ isActive }) =>
      `block p-2 rounded ${
        isActive ? "bg-gray-700" : "hover:bg-gray-700"
      }`
    }
  >
    Sales Return
  </NavLink>
</li>
<NavLink to="/app/purchase-return"
  className={({ isActive }) =>
      `block p-2 rounded ${
        isActive ? "bg-gray-700" : "hover:bg-gray-700"
      }`
    }
  >Purchase Return</NavLink>

      </ul>

    </div>
  );
};

export default Sidebar;