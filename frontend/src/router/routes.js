import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import EmployeeManagementPage from "../pages/EmployeeManagementPage";
import InventoryPage from "../pages/InventoryPage";
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/employees" element={<EmployeeManagementPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
