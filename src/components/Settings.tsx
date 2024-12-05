import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUserLarge } from "react-icons/fa6";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [listSelectedCharacter, setListSelectedCharacter] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Manage sidebar visibility

  const accessToken = localStorage.getItem('access_token');
  const token = localStorage.getItem('user_token');



  useEffect(() => {
    if (accessToken) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [accessToken]);

  console.log("user at setting", user)
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_id')
    navigate('/'); // Redirect to login or homepage after logout
  };

  useEffect(() => {
    // Retrieve `user_id` from localStorage
    const userId = localStorage.getItem('user_id');

    if (userId) {
      // Fetch user-specific selected characters
      const userCharactersKey = `selected_characters_${userId}`;
      const selectedCharacters = JSON.parse(localStorage.getItem(userCharactersKey) || '[]');
      setListSelectedCharacter(selectedCharacters);
    } else {
      // If no user_id is found, clear the list
      setListSelectedCharacter([]);
    }
  }, [token]);

  const handleDeleteCharacter = (index: number) => {
    const updatedCharacters = [...listSelectedCharacter];
    updatedCharacters.splice(index, 1); // Remove the character at the specified index
    setListSelectedCharacter(updatedCharacters);
    localStorage.setItem('selected_characters', JSON.stringify(updatedCharacters)); // Update local storage
  };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div className="flex " >
      <div className='fixed top-0  flex w-full bg-[#141b23]  h-20 items-center '>
        <div className='flex w-[90%] gap-10 mx-auto  '>

          <div className='flex gap-5 justify-center items-center '>
            <div className="flex cursor-pointer" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack  size={28} color="white" />
            </div>
            <div >
              <h2 className="text-xl font-bold text-nowrap text-white">My Profile</h2>
            </div>
            <div>
              <button onClick={toggleSidebar}>{isSidebarOpen ? <MdArrowDropUp size={40} /> : <MdArrowDropDown size={40} />}</button>
            </div>
          </div>
          <div className='flex w-full'>

          </div>
          <div className='flex '>
            <div className="items-center ">

              <button

                className='flex p-4 bg-slate-700 rounded-full justify-center items-center'
              >
                <div >
                  <FaUserLarge size={20} />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Content Container */}

      {/* Left Section - Profile Picture and User Info */}
      <div

        className={`fixed sm:static  top-20 z-50 bg-[#141b23] transition-transform transform ${isSidebarOpen ? 'translate-x-0 w-64 sm:w-2/5 md:w-1/3 lg:w-1/4 2xl:w-1/5' : 'w-0 -translate-x-full'
          }  h-screen overflow-y-auto `}
      >
        <span className="text-xl font-bold px-4">Details</span>
        <div className="flex flex-col items-center my-4">
          <img
            src="./user.png"
            alt="Profile"
            className="w-40 h-40 "
          />
          <div className="text-lg font-semibold mt-4">{user?.name || 'User Name'}</div>
          <div className="text-sm text-gray-500">{user?.email || 'user@example.com'}</div>
        </div>

        {/* Character */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">My Characters</span>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-blue-500 underline"
            >
              {editMode ? <MdDashboardCustomize size={25} onClick={() => navigate("/")} /> : <FaUserEdit size={25} />}
            </button>
          </div>
          {listSelectedCharacter.length == 0 &&
            <div className='flex w-full  text-2xl font-bold h-40 bg-white text-gray-500 justify-center items-center my-4 rounded-xl'>
              No Character Available
            </div>
          }

          {/* Recent Chats Section */}
          {listSelectedCharacter.length > 0 && (
            <div className="h-96 py-8">
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={false}
                arrows={true}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                removeArrowOnDeviceType={["tablet", "mobile"]}
              >
                {listSelectedCharacter.map((character, index) => (
                  <div
                    key={index}
                    className="relative w-full mx-auto h-full"
                  >
                    <div className="relative w-full h-72 rounded-xl bg-cover bg-center hover:border-2 hover:border-pink-600 transition-transform">
                      <img
                        src={`./image/profiles/${character.characterImage}`}
                        alt={character.characterImage}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>

                    {/* Delete Button (Visible in Edit Mode) */}
                    {editMode && (
                      <div
                        className="absolute top-2 right-2 "
                        onClick={() => handleDeleteCharacter(index)}
                      >
                        <MdDelete size={30} color='red' />
                      </div>
                    )}

                    {/* Overlay for text */}
                    <div className="absolute bottom-0 w-full rounded-b-xl bg-gradient-to-t from-black to-transparent p-4">
                      <div className="text-white text-lg font-bold">{character.characterName}</div>
                      <div className="text-gray-300 text-md">{character.scenarioTopic}</div>
                      <div className="text-gray-400 text-sm truncate">{character.scenarioContext}</div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Links and Logout */}
      <div className="flex-1 p-4 overflow-y-auto " style={{ height: 'calc(100vh - 40px)' }}  >
        {/* My Profile Heading */}

        <div className="w-3/4 mx-auto space-y-4">
          {/* Manage My Account */}
          <div
            className="flex py-4 justify-between border-b border-gray-400 cursor-pointer"
            onClick={() => navigate('/manage-account')}
          >
            <span className="text-lg">Manage My Account</span>
            <button className="flex items-center px-4 py-2 rounded-xl border-2 border-pink-600 text-white">
              Edit Account
            </button>
          </div>

          {/* About Us */}
          <div
            className="flex py-4 justify-between border-b border-gray-400 cursor-pointer"
            onClick={() => navigate('/about-us')}
          >
            <span className="text-lg">About Us</span>
            <IoIosArrowForward size={25} />
          </div>

          {/* Privacy Policy */}
          <div
            className="flex py-4 justify-between border-b border-gray-400 cursor-pointer"
            onClick={() => navigate('/privacy-policy')}
          >
            <span className="text-lg">Privacy Policy</span>
            <IoIosArrowForward size={25} />
          </div>

          {/* Restore Purchase */}
          <div
            className="flex py-4 justify-between border-b border-gray-400 cursor-pointer"
            onClick={() => navigate('/restore-purchase')}
          >
            <span className="text-lg">Restore Purchase</span>
            <button className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-b from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">
              Upgrade
            </button>
          </div>

          {/* Terms of Use */}
          <div
            className="flex py-4 justify-between border-b border-gray-400 cursor-pointer"
            onClick={() => navigate('/terms-of-use')}
          >
            <span className="text-lg">Terms of Use</span>
            <IoIosArrowForward size={25} />
          </div>

          {/* Logout Button */}
          <div className="mt-8 text-center pb-20">
            <button
              onClick={handleLogout}
              className="text-lg w-1/3 text-white py-4  rounded-xl border-2 border-pink-600 hover:border-pink-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Settings;


