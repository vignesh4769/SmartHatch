import React, { useState } from "react";

const MessManagement = () => {
  const [meals, setMeals] = useState([
    { day: "Monday", breakfast: "Idly, Peanut Chutney, Sambar", lunch: "Veg Chettinad, Dosakaya Pappu, Potato Kara Fry, Salad", snacks: "Onion Pakoda", dinner: "Veg Kolhapuri, Jeera Rice, Raita, Tomato Curry" },
    { day: "Tuesday", breakfast: "Potato Paratha, Curd, Pickle, Boiled Egg", lunch: "Navaratna Kurma, Tomato Pappu, Tindly Peanut Fry", snacks: "Pungulu, Peanut Chutney", dinner: "Black Channa Curry, Papu Charu, Roti" },
    { day: "Wednesday", breakfast: "Rava Kitchadi, Peanut Chutney, Egg Omelette", lunch: "White Channa Masala, Dal, Goru Pappu, Veg Fry, Salad", snacks: "Boiled Black Channa, Onion Chopped & Tadka", dinner: "Methi Malai Paneer, Andhra Chicken Curry" },
    { day: "Thursday", breakfast: "Poori, Channa Masala, Boiled Egg", lunch: "Methi Channa Masala, Palak Dal, Cabbage, Rasam", snacks: "Boiled Corn", dinner: "Vegetable Do Pyaza, Seasonal Veg Curry, Papad, Roti" },
    { day: "Friday", breakfast: "Vada, Hot Pongal, Peanut Chutney, Sambar, Boiled Egg", lunch: "Mixed Veg Curry, Dal Fry, Thota Kura Fry", snacks: "Fruit Cake", dinner: "Bagara Rice, Kadai Paneer, Punjabi Chicken Curry, Ice Cream" },
    { day: "Saturday", breakfast: "Poha, Chutney, Boiled Egg", lunch: "Matar Kurma, Dal, Ghee, Lady’s Finger", snacks: "Potato Samosa, Tomato Sauce", dinner: "Peanut Butter Masala, Meal Maker, Veg Pulao" },
    { day: "Sunday", breakfast: "Set Dosa, Potato Curry, Peanut Chutney, Sambar", lunch: "Chicken Biryani, Paneer Biryani, Gongura Tomato, Onion & Lemon", snacks: "Muffin (Eggless)", dinner: "Dal Tadka, Potato Tomato Curry, Rava Kesari" }
  ]);
  
  const [newMeal, setNewMeal] = useState({ day: "", breakfast: "", lunch: "", snacks: "", dinner: "" });

  // Handle input change
  const handleChange = (e) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  // Add or update meal plan
  const addMeal = () => {
    if (newMeal.day) {
      setMeals([...meals, newMeal]);
      setNewMeal({ day: "", breakfast: "", lunch: "", snacks: "", dinner: "" });
    }
  };

  return (
    <div className="container mx-auto p-6 ml-48">
      <h2 className="text-3xl font-bold text-center mb-6">Mess Management</h2>
      <p className="text-center text-gray-600 mb-4">Manage daily food schedules for employees.</p>

      {/* Mess Schedule Table */}
      <div className="card bg-base-100 shadow-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4">Mess Schedule</h3>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Snacks</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.breakfast}</td>
                <td>{item.lunch}</td>
                <td>{item.snacks}</td>
                <td>{item.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Meal Plan */}
      <div className="card bg-base-100 shadow-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4">Manage Meal Plan</h3>
        <input type="text" name="day" placeholder="Enter Day" className="input input-bordered w-full mb-3" value={newMeal.day} onChange={handleChange} />
        <input type="text" name="breakfast" placeholder="Enter Breakfast" className="input input-bordered w-full mb-3" value={newMeal.breakfast} onChange={handleChange} />
        <input type="text" name="lunch" placeholder="Enter Lunch" className="input input-bordered w-full mb-3" value={newMeal.lunch} onChange={handleChange} />
        <input type="text" name="snacks" placeholder="Enter Snacks" className="input input-bordered w-full mb-3" value={newMeal.snacks} onChange={handleChange} />
        <input type="text" name="dinner" placeholder="Enter Dinner" className="input input-bordered w-full mb-3" value={newMeal.dinner} onChange={handleChange} />
        <button className="btn btn-primary w-full" onClick={addMeal}>🍽 Add/Edit Meal</button>
      </div>

      {/* View Weekly Meal Plan */}
      <div className="card bg-base-100 shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Weekly Meal Plan</h3>
        <ul className="list-disc pl-5">
          {meals.map((item, index) => (
            <li key={index}><strong>{item.day}:</strong> {item.breakfast}, {item.lunch}, {item.snacks}, {item.dinner}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessManagement;