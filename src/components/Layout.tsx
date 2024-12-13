import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

function Layout() {
  return (
    <div className="flex flex-col h-screen">
     
      {/* Main Content Section */}
      <div className="fixed top-20 w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;



