// Import necessary components and functions
import 'react-responsive-modal/styles.css';
import '../modal/custom-styling.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FaUserLarge } from "react-icons/fa6";
import { getCharacters } from '../services/CharacterService';
import { getScenarios } from '../services/SenarioService';
import { handleGoogleSignIn } from '../services/GoogleLoginService';
import { Modal } from 'react-responsive-modal';



const CharacterSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [listSelectedCharacter, setListSelectedCharacter] = useState<any[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  // Retrieve selected characters from localStorage
  // useEffect hook to update listSelectedCharacter from localStorage
  const token = localStorage.getItem('user_token');
  useEffect(() => {
    // Retrieve selected characters from localStorage
    const selectedCharacters = JSON.parse(localStorage.getItem('selected_characters') || '[]');

    // Update the state with the retrieved characters
    setListSelectedCharacter(selectedCharacters);

    // Log to confirm the state update
    console.log(selectedCharacters);
  }, [token]); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const characterData = await getCharacters();
        const scenarioData = await getScenarios();
        setCharacters(characterData);
        setScenarios(scenarioData);
      } catch (error: any) {
        setError('Failed to load characters or scenarios');
      }
    };

    fetchData();
  }, []);
  const handleCardClick = (characterName: string, scenarioTopic: string, scenarioContext: string) => {
    const character = { characterName, scenarioTopic, scenarioContext };

    // Retrieve the existing selected characters from localStorage, or initialize an empty array if none exist
    const selectedCharacters = JSON.parse(localStorage.getItem('selected_characters') || '[]');

    // Check if the character already exists in the selected characters list
    const characterExists = selectedCharacters.some(
      (selectedCharacter: any) =>
        selectedCharacter.characterName === character.characterName &&
        selectedCharacter.scenarioTopic === character.scenarioTopic &&
        selectedCharacter.scenarioContext === character.scenarioContext
    );

    const token = localStorage.getItem('access_token');

    if (token) {
      if (!characterExists) {
        // Add the new character to the array only if it doesn't already exist
        selectedCharacters.push(character);

        // Save the updated array of selected characters to localStorage
        localStorage.setItem('selected_characters', JSON.stringify(selectedCharacters));

        setSelectedCharacter(character); // Store the selected character
      }

      // Navigate to the chat page with the selected character
      navigate('/chat', { state: character });
    } else {
      // If no token, show the login modal

      setShowModal(true); // Show the modal for Google login
    }
  };


  const handleGoogleLogin = async (response: any) => {
    if (response.credential) {
      try {
        await handleGoogleSignIn(response.credential);
        const decodedToken = jwtDecode<{ name: string; picture: string }>(response.credential);

        setShowModal(false); // Close modal on successful login

        // Store token and user info in local storage
        localStorage.setItem('access_token', response.credential);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        navigate('/');

      } catch (error) {
        console.error("Error during Google login:", error);
      }
    }
  };


  return (
    <div className="  ">


      <div className="flex  ">

        {/* Left side: Character and Scenario List */}
        <div className='w-1/2 md:w-1/4  '>
          <div className=" flex flex-col w-full h-full bg-gray-900  ">
            <div className='p-4'>
              <div className="text-xl font-semibold text-gray-400 ">Recents Chat</div>
            </div>

            <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
              {listSelectedCharacter.map((character, index) => (
                <div
                  key={index}
                  className={`p-2 flex shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer hover:bg-slate-950 ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'
                    }`}
                  onClick={() => handleCardClick(character.characterName, character.scenarioTopic, character.scenarioContext)}
                >
                  <div className='flex w-1/5 justify-center items-center'>
                    <div className='flex p-4 bg-slate-700 rounded-full justify-center items-center'>
                      <FaUserLarge size={25} />
                    </div>
                  </div>

                  <div className="flex flex-col w-4/5 items-start">
                    <div className="px-4">
                      <h2 className="sm:text-md lg:text-lg font-bold text-white">{character.characterName}</h2>
                    </div>
                    <p className="px-4 text-sm text-gray-300 ">
                      {character.scenarioContext.length > 20
                        ? `${character.scenarioContext.slice(0, 20)}...`
                        : character.scenarioContext}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
        <div className="w-1/2 md:w-3/4">
        <div className='flex bg-gray-700  py-2 w-full justify-center items-center '>
          <div className='flex gap-5'>
          
          <img
                        src="./image/Group.png"
                        alt="logo"
                        
                      />
                      <div className='text-md font-bold '>
                      New App On IOS and Android, Tap To Joy !
                      </div>
         
          </div>
          
        </div>
   
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4  "
            style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}
          >
            {characters.map((character, index) => {
              const scenario = scenarios[index];
              return (
                scenario && (
                  <div
                    key={`${character.name}-${scenario.topic}`}
                    className="relative flex flex-col m-2 lg:m-4  rounded-lg hover:cursor-pointer overflow-hidden"
                    onClick={() => handleCardClick(character.name, scenario.topic, scenario.context)}
                  >
                    {/* Bottom div with background image */}
                    <div className="absolute -z-10  ">

                      <img
                        src="./image/backprint.jpg"
                        alt="background"
                        className="w-full h-full object-cover opacity-30 "
                      />
                    </div>

                    {/* Middle div with gray background */}
                    <div className="absolute w-full h-full -z-10 rounded-lg mt-16 bg-gradient-to-b from-slate-800 to-pink-950 "></div>




                    {/* Top div with content */}
                    <div className="inset-0 flex flex-col h-full bg-transparent lg:px-4">
                      <div className="flex w-full my-8 bg-transparent rounded-t-md">
                        <div className="flex md:w-1/4  justify-start items-center">
                          <div className="p-4 rounded-full bg-gray-700">
                            <FaUserLarge size={25} color="skyblue" />
                          </div>
                        </div>
                        <div className="md:w-3/4  text-white">
                          <span className="text-lg font-semibold">{character.name}</span>
                          <p className='text-white font-charm font-regular mt-2 md:text-sm ' >{scenario.topic}</p>
                        </div>
                      </div>
                      <div className="rounded-b-md ">
                        <div >
                          <div className="flex w-full text-white text-sm font-thin p-2">
                         

                            {/* Show 8 words on medium screens, hide on larger screens */}
                            <div className="md:block lg:hidden">
                              {scenario.context.split(' ').slice(0, 8).join(' ') +
                                (scenario.context.split(' ').length > 8 ? '...' : '')}
                            </div>

                            {/* Show full text on large and extra-large screens */}
                            <div className="hidden lg:block ">
                              {scenario.context.split(' ').slice(0, 10).join(' ') +
                                (scenario.context.split(' ').length > 10 ? '...' : '')}
                            </div>

                           
                          </div>

                        </div>
                        <div className="flex py-2 justify-end ">
                          <button className="flex items-center justify-center rounded-full font-bold text-sm text-white px-4 py-2 bg-gradient-to-b from-pink-500 to-blue-800">
                            Chat Now
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>


      </div>

      {/* Modal for Google Sign-In */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        center
        classNames={{ modal: 'customModal' }}
      >
        <div className="p-2 rounded-lg text-center">
          <h2 className="text-3xl font-bold text-white">Leela Land</h2>
          <p className="mb-6 text-gray-700">Sign in to continue to chat with your chosen character!</p>
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={(response) => {
                if (response) {
                  handleGoogleLogin(response);
                }
              }}
              onError={() => {
                console.error("Login Failed");
                setShowModal(false);
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CharacterSelectionPage;







