import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">SmartHatch</h1>
      <ul className="flex space-x-4">
        <li><Link to="/employees">Employees</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/financials">Financials</Link></li>
        <li><Link to="/analytics">Analytics</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
