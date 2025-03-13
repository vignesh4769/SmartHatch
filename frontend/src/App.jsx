import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/UI/Navbar";
import LoginPage from "./pages/LoginPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import InventoryPage from "./pages/InventoryPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/employees" element={<EmployeeManagementPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
