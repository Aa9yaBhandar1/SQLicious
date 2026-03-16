import {useState, useEffect} from "react";
import ManageMenu from "../MenuPage/ManageMenu";
import RestaurantContent from "./RestaurantContent";
import CustomerContent from "./CustomerContent";
const  DashboardContent= () => {

  const [user, setUser] = useState(null);

  useEffect(()=> {
    const savedUser = localStorage.getItem("user") || "{}";
    if(savedUser){
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if(!user) 
    return (
    <div className='p-10 text-[#BEB7A4'>
      Loading Profile...
    </div>
    );


  const isRestaurant = user?.role === "restaurant";
  const restaurant_id = user?.restaurant_id;
  console.log(restaurant_id);


  return (
     <div className="p-10 max-w-7xl mx-auto">
        {isRestaurant ? (
          <RestaurantContent/>
        ) : (
          <CustomerContent/>
        )}
      </div>
  )
}


export default DashboardContent;