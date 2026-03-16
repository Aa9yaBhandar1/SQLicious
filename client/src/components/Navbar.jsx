import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUserFromToken } from "../utils/tokenUtils";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const token = localStorage.getItem("token");
  const user = getUserFromToken();
  console.log(user);
  const isRestaurant = user?.role === "restaurant";

  if (token && !user) {
    return null; 
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/sign-in");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link to="/" className="text-2xl font-black text-[#FF7F11] tracking-tight">
        SQL<span className="text-gray-800">icious</span>
      </Link>

      <div className="flex items-center gap-8">
        {token ? (
          <>
            {/* Conditional Routes based on Role */}
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              {isRestaurant ? (
                <>
                  <Link to="/manage-menu" className="hover:text-[#FF7F11]">My Menu</Link>
                  <Link to="/orders" className="hover:text-[#FF7F11]">Orders Received</Link>
                  <Link to="/analytics" className="hover:text-[#FF7F11]">Analytics</Link>
                </>
              ) : (
                <>
                  <Link to="/restaurants" className="hover:text-[#FF7F11]">Explore</Link>
                  <Link to="/orders" className="hover:text-[#FF7F11]">My Orders</Link>
                  <Link to="/cart" className="flex items-center gap-1 text-[#FF7F11]">
                    <span>🛒</span> <span className="bg-[#CBE896] px-2 py-0.5 rounded-full text-xs text-black">3</span>
                  </Link>
                </>
              )}
            </div>

            {/* Profile Avatar Circle */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-[#CBE896] border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-700 hover:scale-105 transition"
              >
                {user.name?.charAt(0) || "U"}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Profile Settings</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/sign-in" className="text-sm font-semibold text-gray-500 hover:text-gray-800">Sign In</Link>
            <Link to="/sign-up" className="bg-[#FF7F11] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-200 hover:translate-y-[-2px] transition">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;