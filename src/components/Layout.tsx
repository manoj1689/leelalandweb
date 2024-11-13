import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import { googleLogout } from '@react-oauth/google';

function Layout() {
  const navigate = useNavigate(); // Move useNavigate inside the component

  const handleGoogleLogout = () => {
    googleLogout();
    navigate("/"); // Redirect to home or login page after logout
  };

  return (
    <div>
      <div className='fixed top-0 w-full'>
      <Header onLogout={handleGoogleLogout} />
      </div>
   
      <div className='fixed top-20 w-full' >
        <Outlet />
      </div>
    
     
    </div>
  );
}

export default Layout;


