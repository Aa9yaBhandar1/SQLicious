import {useState, useEffect} from "react";

const  DashboardContent= () => {

  const [user, setUser] = useState(null);

  useEffect(()=> {
    const savedUser = localStorage.getItem("user") || "{}";
    if(savedUser){
      setUser(JSON.parse(savedUser));
    }
  }, []);
  if(!user) return <div className='p-10 text-[#BEB7A4'>Loading Profile...</div>
  const isRestaurant = user.role === "restaurant";

  return (
     <div className="p-10 max-w-7xl mx-auto">
        {isRestaurant ? (
          /* RESTAURANT OWNER VIEW */
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Today's Orders" value="24" color="bg-[#CBE896]" />
            <StatCard title="Revenue" value="$1,240" color="bg-[#FF7F11]" />
            <StatCard title="Active Items" value="12" color="bg-[#BEB7A4]" />
          </section>
        ) : (
          /* CUSTOMER VIEW */
          <>
            {/* Section: Popular Restaurants */}
            <section className="mb-16">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Popular Nearby</h2>
                  <div className="h-1 w-12 bg-[#FF7F11] rounded-full mt-1"></div>
                </div>
                <button className="text-[#FF7F11] font-semibold text-sm hover:underline">View All</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((id) => (
                  <div key={id} className="group cursor-pointer">
                    <div className="h-52 bg-gray-200 rounded-3xl mb-4 overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all duration-300">
                      {/* API DATA: <img src={res.image} /> */}
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                        ⭐ 4.8
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#FF7F11] transition">The Italian Bistro</h3>
                    <p className="text-sm text-gray-500">Pasta • Pizza • 20-30 min</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Top Dishes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Dishes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((id) => (
                  <div key={id} className="bg-white p-3 rounded-2xl border border-gray-100 hover:border-[#CBE896] transition-all shadow-sm hover:shadow-md">
                    <div className="h-32 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-2xl">
                      {/* API DATA: Dish Image */}
                      🍜
                    </div>
                    <p className="font-bold text-gray-800 text-sm">Spicy Ramen</p>
                    <p className="text-[#FF7F11] font-bold">$12.99</p>
                    <button className="w-full mt-3 py-2 bg-gray-50 rounded-lg text-xs font-bold hover:bg-[#CBE896] transition">
                      + Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
  )
}


// Reusable Small Component for Restaurant Stats
const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-3xl shadow-sm border border-gray-100 bg-white`}>
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <p className="text-3xl font-black mt-1">{value}</p>
    <div className={`h-1 w-8 ${color} mt-4 rounded-full`}></div>
  </div>
);
export default DashboardContent;