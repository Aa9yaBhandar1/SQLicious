import React from 'react'

const CustomerContent = () => {
  return (
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
  )
}

export default CustomerContent