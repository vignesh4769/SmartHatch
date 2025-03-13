import { useState } from "react";

const InventoryTable = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Feed", quantity: 50, price: 100 },
    { id: 2, name: "Medicine", quantity: 20, price: 250 },
  ]);

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">ID</th>
          <th className="border p-2">Item</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Price</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item) => (
          <tr key={item.id}>
            <td className="border p-2">{item.id}</td>
            <td className="border p-2">{item.name}</td>
            <td className="border p-2">{item.quantity}</td>
            <td className="border p-2">{item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;
