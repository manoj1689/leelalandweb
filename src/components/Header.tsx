import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { handleGoogleSignIn } from '../services/GoogleLoginService';
import { FaSearch } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaUserLarge } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import AddPartner from "../components/AddPartner"
import { MdUpdate } from "react-icons/md";
import Pricing from '../components/Pricing';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPricingOpen, setIsPricingModalOpen] = useState(false);
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
    navigate("/")
  };


  console.log("user at header", user)
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenPricingModal = () => {
    setIsPricingModalOpen(true);
  };

  const handleClosePricingModal = () => {
    setIsPricingModalOpen(false);
  };
  return (
    <header className="fixed top-0 left-0 w-full h-20  bg-[#1E2C3B] border-b-4 border-[#1b2735]">
     <div className='flex w-full py-2 '>
     <div className="flex  max-sm:hidden sm:w-2/5 md:w-1/3 lg:w-1/4 2xl:w-1/5 justify-center items-center gap-2  ">
          <img src="./image/Group.png" alt="website logo" className="w-8 h-8 sm:w-12 sm:h-12 " />
          <h1 className="text-xl md:text-3xl lg:text-4xl font-sans  font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#2F9FFC] to-[#C702F5]">
            Leela Land
          </h1>

        </div>

      <div className='flex w-full sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5 pr-4'>
      <div className="flex max-md:hidden w-full   md:w-1/2  justify-start items-center ">
          <div className="flex ">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#434F5B] mx-4  rounded-full">
              <input
                type="text"
                placeholder="Find Your AI Partner.."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-[#434F5B] text-white md:px-4 py-2 focus:outline-none rounded-full w-full xl:w-96 "
              />

              <button type="submit" className="ml-2 text-white font-bold md:px-4 py-2 transition">
                <FaSearch size={20} color='gray' />
              </button>
            </form>
          </div>




        </div>
        <div className='flex w-full md:w-1/2   justify-end items-center  '>
          <div className=''>
            <button onClick={handleOpenModal} className="flex  text-gray-300 bg-transparent p-2 items-center rounded-xl  hover:bg-violet-600 border-2 border-violet-800 transition">
              <span > <IoIosAdd size={25} /></span> <span className='text-xs md:text-md max-lg:hidden '>Add Partner</span>
            </button>
          </div>
          <div className='px-4'>
            <button
              onClick={handleOpenPricingModal}
              className="flex text-gray-300  p-2 lg:p-4 items-center rounded-xl  transition bg-gradient-to-b from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500"
            >
              <span className="text-xs md:text-md max-lg:hidden">Upgrade Pro</span>
              <span className='block lg:hidden'><MdUpdate size={25} /></span>
            </button>

          </div>
          {!accessToken ? (
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Login Failed')}
            />
          ) : (
            <div className="flex items-center space-x-4">

              <button
                onClick={() => navigate("/settings", { state: { userinfo: user } })}
                className='flex p-4 bg-slate-700 rounded-full justify-center items-center'
              >
                <div >
                  <FaUserLarge size={25} />
                </div>
              </button>
            </div>
          )}
        </div>

      </div>


     </div>
      
      
     


      <Modal open={isModalOpen} onClose={handleCloseModal} center
        classNames={{ modal: 'customModalAddPartner' }} >
        <div className=' '>


          <AddPartner closeModal={handleCloseModal} />
        </div>

      </Modal>
      <Modal open={isModalPricingOpen} onClose={handleClosePricingModal} center
        classNames={{ modal: 'customModalAddPartner' }} >
        <div className=' '>


          <Pricing />
        </div>

      </Modal>
    </header>
  );
};

export default Header;




