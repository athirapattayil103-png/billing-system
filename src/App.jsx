import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import Expenses from "./pages/Expenses";
import SalesReturn from "./pages/SalesReturn";
import MainLayout from "./layout/MainLayout";
import PurchaseReturn from "./pages/PurchaseReturn";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/app" element={<MainLayout />}>

  <Route path="dashboard" element={<Dashboard />} />
  <Route path="products" element={<Products />} />
  <Route path="purchase" element={<Purchase />} />
  <Route path="sales" element={<Sales />} />
  <Route path="expenses" element={<Expenses />} />
  <Route path="sales-return" element={<SalesReturn />} />
<Route path="purchase-return" element={<PurchaseReturn />} />
<Route path="reports" element={<Reports />} />
</Route>
    </Routes>
  );
}

export default App;