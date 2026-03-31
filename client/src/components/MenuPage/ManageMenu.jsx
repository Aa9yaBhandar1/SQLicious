import React, { useEffect, useState } from "react";

const ManageMenu = ({ restaurant_id }) => {

  const [menu, setMenu] = useState([]);
  const [name,setName] = useState("");
  const [price,setPrice] = useState("");
  const [category,setCategory] = useState("");

  const fetchMenu = async () => {
    const res = await fetch(
      `http://localhost:5000/api/restaurant/${restaurant_id}/menu`
    );
    const data = await res.json();
    setMenu(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addItem = async () => {
    await fetch(
      `http://localhost:5000/api/restaurant/${restaurant_id}/menu`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({name,price,category})
      }
    );

    fetchMenu();
  };

  const deleteItem = async (item_id) => {
    await fetch(
      `http://localhost:5000/api/restaurant/menu/${item_id}`,
      { method:"DELETE" }
    );

    fetchMenu();
  };

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Manage Menu
      </h1>

      {/* Add Menu Form */}

      <div className="flex gap-3 mb-8">

        <input
          placeholder="Item Name"
          className="border p-2 rounded"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Price"
          className="border p-2 rounded"
          onChange={(e)=>setPrice(e.target.value)}
        />

        <input
          placeholder="Category"
          className="border p-2 rounded"
          onChange={(e)=>setCategory(e.target.value)}
        />

        <button
          onClick={addItem}
          className="bg-black text-white px-4 rounded"
        >
          Add
        </button>

      </div>

      {/* Menu List */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {menu.map((item)=>(
          <div
            key={item.item_id}
            className="bg-white shadow p-4 rounded"
          >

            <h2 className="font-semibold">
              {item.name}
            </h2>

            <p className="text-gray-500">
              {item.category}
            </p>

            <p className="text-green-600 font-semibold">
              ${item.price}
            </p>

            <button
              onClick={()=>deleteItem(item.item_id)}
              className="text-red-500 mt-2"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ManageMenu;