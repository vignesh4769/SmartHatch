import InventoryTable from "../components/Inventory/InventoryTable";

const InventoryPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <InventoryTable />
    </div>
  );
};

export default InventoryPage;
