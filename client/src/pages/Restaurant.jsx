import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  return (
    <div 
    onClick={()=> navigate(`/restaurant/${restaurant.restaurant_id}/menu`)}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer group">

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={restaurant.image_url || "https://source.unsplash.com/600x400/?restaurant,food"}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Rating badge */}
        <div className="absolute top-3 left-3 bg-white text-sm font-semibold px-2 py-1 rounded-lg shadow">
          ⭐ {restaurant.rating || "4.5"}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {restaurant.name}
        </h2>

        <p className="text-gray-500 text-sm mt-1 truncate">
          {restaurant.address}
        </p>

        <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded-md">
            {restaurant.category || "Multi-cuisine"}
          </span>

          <span className="text-green-600 font-medium">
            Open
          </span>
        </div>
      </div>
    </div>
  );
};

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getRestaurants = async () => {
      const response = await fetch("http://localhost:5000/api/restaurant/");
      const data = await response.json();
      setRestaurants(data);
    };

    getRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Restaurants
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.restaurant_id}
            restaurant={restaurant}
          />
        ))}

      </div>

    </div>
  );
};

export default Restaurant;