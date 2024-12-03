import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { handleGoogleSignIn } from '../services/GoogleLoginService';
import { FaSearch } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaUserLarge } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import AddPartner from "../components/AddPartner";
import { MdUpdate } from "react-icons/md";
import Pricing from '../components/Pricing';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ sub: string; picture: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalPricingOpen, setIsPricingModalOpen] = useState(false);

  const accessToken = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');

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
        const decodedToken = jwtDecode<{ sub: string; picture: string }>(response.credential);
        console.log("decoded token",decodedToken)
        // Store token and user info in local storage
        localStorage.setItem('access_token', response.credential);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        localStorage.setItem('user_id', decodedToken.sub); // Assuming `name` is a unique identifier
        setUser(decodedToken);
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    }
    setShowModal(false); // Close Google Sign-In modal after login
    navigate("/");
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenAddPartner = () => {
    if (userId) {
      setIsModalOpen(true); // Open Add Partner modal if user is logged in
    } else {
      setShowModal(true); // Open Google Sign-In modal if user is not logged in
    }
  };
  const handleOpenGoogleLogin = () => {

    setShowModal(true); // Open Google Sign-In modal if user is not logged in

  };
  const handleSearchBar = () => {
    if (userId) {
      navigate("/searchcharacter"); // Open Add Partner modal if user is logged in
    } else {
      setShowModal(true); // Open Google Sign-In modal if user is not logged in
    }
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
      <div className='flex w-full h-20 p-2  sm:p-4 justify-end items-center'>
        <div className={`flex ${userId ? "max-sm:hidden " : ""} w-2/5 sm:w-2/5 md:w-1/3 lg:w-1/4 2xl:w-1/5 justify-start  items-center gap-2`}>

          <img src="./image/Group.png" alt="website logo" className="w-8 h-8 sm:w-12 sm:h-12" />
          <h1 className=" sm:text-xl md:text-3xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#2F9FFC] to-[#C702F5]">
            Leela Land
          </h1>
        </div>


        <div className={`flex  w-3/5  sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5 `}>
          <div className="flex  max-sm:hidden md:w-1/2  justify-start items-center  ">
            <div className="flex  bg-[#434F5B] rounded-full py-2 " onClick={handleSearchBar}>

              <input
                type="text"
                placeholder="Find Your AI Partner.."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-[#434F5B] text-white md:px-4 py-2 focus:outline-none rounded-full placeholder:px-2 w-full xl:w-96 cursor-pointer max-sm:hidden "

              />

              <button type="submit" className=" text-white font-bold px-4 py-2 transition">
                <FaSearch size={20} color='gray' />
              </button>

            </div>




          </div>
          <div className='flex w-full md:w-1/2 gap-2 sm:gap-3 justify-end items-center'>
            <div className="  max-sm:block hidden  bg-[#434F5B] rounded-full py-2 " onClick={handleSearchBar}>

              <input
                type="text"
                placeholder="Find Your AI Partner.."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-[#434F5B] text-white md:px-4 py-2 focus:outline-none rounded-full placeholder:px-2 w-full xl:w-96 cursor-pointer max-sm:hidden "

              />

              <button type="submit" className=" text-white font-bold px-4 py-2 transition">
                <FaSearch size={20} color='gray' />
              </button>

            </div>
            <div className=''>
              <button onClick={handleOpenAddPartner} className="flex  text-gray-300 bg-transparent p-2 items-center rounded-xl  hover:bg-violet-600 border-2 border-violet-800 transition">
                <span > <IoIosAdd size={25} /></span> <span className='text-xs md:text-md max-lg:hidden '>Add Partner</span>
              </button>
            </div>
            <div className='max-sm:hidden'>
              <button
                onClick={handleOpenPricingModal}
                className="flex text-gray-300  p-2 lg:p-4 items-center rounded-xl  transition bg-gradient-to-b from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500"
              >
                <span className="text-xs md:text-md max-lg:hidden">Upgrade Pro</span>
                <span className='block lg:hidden'><MdUpdate size={25} /></span>
              </button>

            </div>
            {!accessToken ? (
              <>
                {/* Button visible on small screens */}
                <div className="block lg:hidden">
                  <button onClick={handleOpenGoogleLogin} className="flex items-center justify-center bg-white rounded-full p-2 w-12">
                    <img src="/google.png" alt="Google Login" className="w-7" />
                  </button>
                </div>

                {/* GoogleLogin visible on medium and larger screens */}
                <div className="hidden lg:block">
                  <GoogleLogin
                    onSuccess={(response) => handleGoogleLogin(response)}
                    onError={() => console.error('Login Failed')}
                  />
                </div>
              </>

            ) : (
              <div className="flex items-center space-x-4">

                <button
                  onClick={() => navigate("/settings", { state: { userinfo: user } })}
                  className='flex p-4 bg-slate-700 rounded-full justify-center items-center'
                >
                  <div >
                    <FaUserLarge size={20} />
                  </div>
                </button>
              </div>
            )}
          </div>

        </div>


      </div>


      {/* Modal for Google Sign-In */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        center
        classNames={{ modal: 'customModalGoogle' }}
      >
        <div className="p-4 text-center">
          <h2 className="text-3xl font-bold text-white">Leela Land</h2>
          <p className="mb-4 text-gray-700">Sign in to chat with characters!</p>
          <div className='flex justify-center'>
            <GoogleLogin
              onSuccess={(response) => handleGoogleLogin(response)}
              onError={() => console.error('Login Failed')}
            />
          </div>

        </div>
      </Modal>


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




