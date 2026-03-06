import React, { useState } from 'react';
import GeneralSettings from '../components/ProfileSetting/GeneralSetting';
import OrderHistory from '../components/ProfileSetting/OrderHistory';
import BusinessProfile from '../components/ProfileSetting/BusinessProfile';
import AccountSettings from '../components/ProfileSetting/AccountSettings';

const ProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("general");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isRestaurant = user.role === "restaurant";

  // Sidebar Menu Configuration
  const menuItems = [
    { id: 'general', label: 'General', icon: '👤', roles: ['customer', 'restaurant'] },
    { id: 'business', label: 'My Store', icon: '🏪', roles: ['restaurant'] },
    { id: 'orders', label: 'Orders', icon: '📦', roles: ['customer'] },
    { id: 'security', label: 'Security', icon: '🔒', roles: ['customer', 'restaurant'] },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralSettings user={user} />;
      case 'business': return <BusinessProfile user={user} />;
      case 'orders': return <OrderHistory />;
      case 'security': return <AccountSettings/>
      default: return <GeneralSettings user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFC] p-4 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 space-y-1">
          <div className="mb-8 px-4">
            <h1 className="text-3xl font-black text-gray-900">Settings</h1>
            <p className="text-gray-400 text-sm">Manage your SQLicious account</p>
          </div>
          
          {menuItems.filter(item => item.roles.includes(user.role)).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-[#FF7F11] text-white shadow-lg shadow-orange-100 scale-105' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;