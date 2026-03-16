import React, { useEffect, useState } from 'react';
import DashboardContent from '../components/dashboard/DashboardContent';
import DashboardHeader from '../components/dashboard/DashboardHeader';
const Dashboard = () => {

  return (
    <div className="bg-[#FFFFFC] min-h-screen pb-20">
      {/* Hero Header */}
      <DashboardHeader/>
      <DashboardContent/>

     
    </div>
  );
};



export default Dashboard;