import React, { useEffect, useState } from "react";

const ManageMenu = ({ restaurant_id }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", image: null });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5001/api/restaurant/${restaurant_id}/menu`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setMenu(data);
      } else {
        setMenu([]);
      }
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant_id) fetchMenu();
  }, [restaurant_id]);

  const addItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("category", newItem.category);
    formData.append("image", newItem.image);

    try {
      const res = await fetch(`http://localhost:5001/api/restaurant/${restaurant_id}/menu`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setNewItem({ name: "", price: "", category: "", image: null });
        fetchMenu();
      }
    } catch (err) {
      alert("Error adding item");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Your Menu</h1>

      {/* Input Form */}
      <form onSubmit={addItem} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-2 gap-4">
        <input placeholder="Item Name" className="border p-2 rounded" required
          value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <input placeholder="Price" type="number" className="border p-2 rounded" required
          value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
        <select className="border p-2 rounded" required
          value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
          <option value="">Select Category</option>
          <option value="Starter">Starter</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>
        <input type="file" className="p-1" required
          onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })} />
        <button type="submit" className="col-span-2 bg-orange-600 text-white py-2 rounded font-bold hover:bg-orange-700 transition-colors">
          Add Item
        </button>
      </form>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading menu items...</div>
      ) : menu?.length > 0 ? (
        <div className="grid gap-4">
          {menu.map((item) => (
            <div key={item.item_id} className="flex justify-between items-center bg-white p-4 rounded shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-4">
                <img
                  src={item.image_url || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category} • ${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 border-2 border-dashed rounded-lg text-gray-400">
          No items in your menu yet. Add your first dish above!
        </div>
      )}
    </div>
  );
};

export default ManageMenu;