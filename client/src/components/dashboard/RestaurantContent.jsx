import React, { useEffect, useState } from "react";
import ManageMenu from "../MenuPage/ManageMenu";

const RestaurantContent = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getRestaurants = async () => {
      const response = await fetch("http://localhost:5000/api/restaurant/");
      const data = await response.json();
      setRestaurants(data);
    };

    getRestaurants();
  }, []);

  return(
    <>
      <ManageMenu restaurantId={restaurant.restaurant_id}/>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Today's Orders" value="24" color="bg-[#CBE896]" />
            <StatCard title="Revenue" value="$1,240" color="bg-[#FF7F11]" />
            <StatCard title="Active Items" value="12" color="bg-[#BEB7A4]" />
          </section>
    </>
  );

}


// Reusable Small Component for Restaurant Stats
const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-3xl shadow-sm border border-gray-100 bg-white`}>
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <p className="text-3xl font-black mt-1">{value}</p>
    <div className={`h-1 w-8 ${color} mt-4 rounded-full`}></div>
  </div>
);

export default RestaurantContent;