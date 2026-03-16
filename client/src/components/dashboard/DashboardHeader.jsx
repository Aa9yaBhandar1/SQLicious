import {useState, useEffect} from "react";
import { getUserFromToken } from "../../utils/tokenUtils";

const DashboardHeader = () => {
    const [user, setUser] = useState(null);
  
    useEffect(()=> {
      const savedUser = getUserFromToken() || "{}";
      if(savedUser){
        setUser(savedUser);
      }
    }, []);
    if(!user) return <div className='p-10 text-[#BEB7A4'>Loading Profile...</div>
    const isRestaurant = user.role === "restaurant";
  return (
    <header className="px-10 py-12 bg-gradient-to-r from-[#FF7F11] to-[#FF1B1C] text-white">
        <h1 className="text-4xl font-black mb-2">
          {isRestaurant ? `Welcome back, ${user.name}!` : "Hungry? We've got you."}
        </h1>
        <p className="opacity-90">
          {isRestaurant ? "Here is what's happening with your kitchen today." : "Discover the best meals from local favorites."}
        </p>
      </header>
  )
}

export default DashboardHeader;