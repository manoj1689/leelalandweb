import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { handleGoogleSignIn } from '../services/GoogleLoginService';
import { IoSearchOutline } from "react-icons/io5";
interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (accessToken) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [accessToken]);

  const handleGoogleLogin = async (response: any) => {
    if (response.credential) {
      try {
        await handleGoogleSignIn(response.credential);
        const decodedToken = jwtDecode<{ name: string; picture: string }>(response.credential);

        // Store token and user info in local storage
        localStorage.setItem('access_token', response.credential);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        setUser(decodedToken);
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    }
  };

  const handleGoogleLogout = () => {
    googleLogout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    onLogout();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle search logic, like redirecting or filtering
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-gray-900 flex w-full text-white py-4 shadow-lg">
      <div className="flex w-full   items-center">
        <div className="flex w-1/3 lg:w-1/4 justify-center items-center gap-2">
          <img src="./image/Group.png" alt="website logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl md:text-4xl text-violet-700 font-bold">Leela Land</h1>
        </div>

        <div className="flex max-lg:hidden lg:w-2/4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-800 p-2 rounded-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-gray-700 text-white px-4 py-2 rounded-full w-80"
            />
            <button type="submit" className="ml-2 text-white px-4 py-2 transition">
            <IoSearchOutline size={20} />
            </button>
          </form>
        </div>


        <div className="flex w-2/3 lg:w-1/4 justify-end px-8">


          {/* Google Login / User Avatar */}
          {!accessToken ? (
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Login Failed')}
            />
          ) : (
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <img src="./user.png" alt="User Avatar" className="w-10 h-10 rounded-full" />
                  <span className="text-white">{user.name}</span>
                </>
              )}
              <button
                onClick={handleGoogleLogout}
                className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;



