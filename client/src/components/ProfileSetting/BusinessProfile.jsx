const BusinessProfile = ({ user }) => (
  <div className="space-y-6">
    <header>
      <h2 className="text-2xl font-bold text-gray-800">Restaurant Setup</h2>
      <p className="text-gray-500">Manage your digital storefront</p>
    </header>
    
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl space-y-4">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-[#FF7F11] rounded-3xl shadow-inner flex items-center justify-center text-3xl text-white font-black">
          {user.name?.charAt(0)}
        </div>
        <div>
          <button className="text-sm font-bold text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-black transition">Change Banner</button>
          <p className="text-xs text-gray-400 mt-2">Recommended: 1200x400px</p>
        </div>
      </div>
      {/* API IMPORT: updateRestaurantInfo */}
    </div>
  </div>
);
export default BusinessProfile;