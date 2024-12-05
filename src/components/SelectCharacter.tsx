// Import necessary components and functions
import 'react-responsive-modal/styles.css';
import '../modal/custom-styling.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import {Character,Scenario,CombinedData}from "../interfaces/interfaces"
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FaUserLarge } from "react-icons/fa6";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoMdChatbubbles } from "react-icons/io";
import { getCharacters } from '../services/CharacterService';
import { getScenarios } from '../services/SenarioService';
import { handleGoogleSignIn } from '../services/GoogleLoginService';
import { getPartners } from '../services/PatnerService'; // Import partner service
import { BiMenuAltLeft } from "react-icons/bi";
import { Modal } from 'react-responsive-modal';

const CharacterSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [listSelectedCharacter, setListSelectedCharacter] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
  const [partners, setPartners] = useState<any[]>([]); // State for partners
  const token = localStorage.getItem('user_token');

  const combineScenariosAndCharacters = (
    scenarios: Scenario[],
    characters: Character[]
  ): CombinedData[] => {
    return scenarios.flatMap((scenario) =>
      scenario.characters
        .map((charId) => {
          const character = characters.find((char) => char.id === charId);
          return character
            ? {
                scenarioId: scenario.id,
                topic: scenario.topic,
                category: scenario.category,
                difficulty: scenario.difficulty,
                context: scenario.context,
                prompt: scenario.prompt,
                character: {
                  id: character.id,
                  name: character.name,
                  description: character.description,
                  behavior: character.behavior,
                  identity: character.identity,
                  imageName: character.image_name,
                },
              }
            : null; // Return null if no matching character is found
        })
        .filter(Boolean) as CombinedData[] // Type assertion to ensure only non-null values remain
    );
  };
  
  const combinedData = combineScenariosAndCharacters(scenarios, characters);
console.log("list of all data" ,combinedData )
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

    const fetchPartners = async () => {
      try {
        const partnerData = await getPartners();
        setPartners(partnerData);
      } catch (error: any) {
        console.error('Failed to load partners', error);
      }
    };

    fetchData();
    fetchPartners(); // Fetch partners
  }, []);


  const handleCardClick = (
    characterName: string,
    characterImage: string,
    characterDescription: string,
    characterIdentity: any,
    scenarioTopic: string,
    scenarioContext: string,
    scenarioPrompt: string,
    scenarioImage: string
  ) => {
    // Construct the character object
    const character = {
      characterName,
      characterImage,
      characterIdentity,
      characterDescription,
      scenarioTopic,
      scenarioContext,
      scenarioPrompt,
      scenarioImage,
    };
  
    // Retrieve `user_id` from local storage
    const userId = localStorage.getItem('user_id'); // Use the correct `user_id` field
    if (!userId) {
      setShowModal(true);
      return;
    }
  
    // Retrieve selected characters for the specific user
    const userCharactersKey = `selected_characters_${userId}`;
    const selectedCharacters = JSON.parse(localStorage.getItem(userCharactersKey) || '[]');
  
    // Check if the character already exists
    const characterExists = selectedCharacters.some(
      (selectedCharacter: any) =>
        selectedCharacter.characterName === character.characterName &&
       
        selectedCharacter.characterDescription === character.characterDescription &&
        selectedCharacter.scenarioTopic === character.scenarioTopic 
     
    );
   console.log("character exists",characterExists)
    const token = localStorage.getItem('access_token');
  
    if (token) {
      if (!characterExists) {
        // Add the character to the user's selected characters
        selectedCharacters.push(character);
        localStorage.setItem(userCharactersKey, JSON.stringify(selectedCharacters));
        setSelectedCharacter(character);
      }
      // Navigate to the chat page with the selected character's data
      navigate('/chat', { state: character });
    } else {
      // Show the login modal if the token is not present
      setShowModal(true);
    }
  };
  
  const handleGoogleLogin = async (response: any) => {
    if (response.credential) {
      try {
        await handleGoogleSignIn(response.credential);
        const decodedToken = jwtDecode<{ name: string; picture: string }>(response.credential);
        setShowModal(false);
        localStorage.setItem('access_token', response.credential);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        navigate('/');
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handlePartnerClick = (partner: any) => {
    console.log('Partner clicked:', partner);
    // Add functionality for partner click, if needed
    navigate('/chatpartner', { state: { partner: partner } });
  };
  return (
    <div className="flex w-full ">
      <div>
        <Header/>
      </div>
      {/* Sidebar Section */}
      {listSelectedCharacter.length>0 && (
 <div className='flex  sm:w-2/5 md:w-1/3 lg:w-1/4 2xl:w-1/5 '>

 <button
   className="md:hidden fixed top-5 left-4 z-50 text-white rounded-lg"
   onClick={toggleSidebar}
 >
   {isSidebarOpen ? <AiOutlineClose size={40} /> : <BiMenuAltLeft size={40} />}
 </button>
 <div className="md:hidden fixed top-6 bg-orange-300 left-16 z-50   text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#0096FF] to-[#E407EC]  ">
 <img src="./image/Group.png" alt="website logo" className="w-8 h-8" />
 </div>
 <div
   className={`fixed sm:static top-20 left-0  h-full bg-[#1E2C3B] transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
     } sm:translate-x-0 w-64 sm:w-full z-40`}
    
 >
   {/* Recent Chats Section */}
   {listSelectedCharacter.length > 0 && (
     <div className='top-20'>
       <div className="flex  h-16 items-center justify-start px-4 border-b border-gray-700">
         <div className="text-xl font-semibold text-stone-500">Recent Chats</div>
         <div> </div>
       </div>
       <div
         className="flex flex-col overflow-y-auto scroll-smooth"
         style={{ height: 'calc(50vh - 5rem)' }}
       
       >
         {listSelectedCharacter.map((character, index) => (
           <div
             key={index}
             className={`p-2 flex shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer hover:bg-[#192531] ${index % 2 === 0 ? 'bg-[#1E2C3B]' : 'bg-[#203449]'
               }`}
             onClick={() =>
               handleCardClick(
                 character.characterName,
                 character.characterImage,
                 character.characterDescription ,
                 character.characterIdentity,
                 character.scenarioTopic,
                 character.scenarioContext,
                 character.scenarioPrompt,
                 character.scenarioImage
               )
             }
             
           >
             <div className="flex w-1/5 justify-center items-center">
               <div className="flex  ">
                 <img src={`./image/profiles/${character.characterImage}`}
                   alt={character.image_name}
                   className="rounded-full  object-fill" />
               </div>
             </div>
             <div className="flex flex-col w-4/5 items-start">
               <div className="px-4">
                 <h2 className="sm:text-md lg:text-lg font-bold text-white">
                   {character.characterName}
                 </h2>
               </div>
               <p className="px-4 text-sm text-gray-300">
                 {character.scenarioContext.length > 20
                   ? `${character.scenarioContext.slice(0, 20)}...`
                   : character.scenarioContext}
               </p>
             </div>
           </div>
         ))}
       </div>
     </div>
   )}

   {/* Partners Section */}
   {partners.length > 0 && (
     <div>
       <div className="flex h-16 items-center justify-start px-4 border-b border-gray-700 mt-4">
         <div className="text-xl font-semibold text-stone-500">Partners</div>
       </div>
       <div
         className="flex flex-col overflow-y-auto scroll-smooth "
         style={{ height: 'calc(40vh - 5rem)' }}
       >
         {partners.map((partner, index) => (
           <div
             key={index}
             className={`p-2 flex shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer hover:bg-[#192531] ${index % 2 === 0 ? 'bg-[#1E2C3B]' : 'bg-[#203449]'
               }`}
             onClick={() => handlePartnerClick(partner)}
           >
             <div className="flex w-1/5 justify-center items-center">

               <img
                 src={`./AvatarsImage/${partner.image}`}
                 alt={partner.image}
                 className="w-full  rounded-xl"
               />

             </div>
             <div className="flex flex-col w-4/5 items-start">
               <div className="px-4">
                 <h2 className="sm:text-md lg:text-lg font-bold text-white">{partner.name}</h2>
               </div>
               <p className="px-4 text-sm text-gray-300">
                 {partner.description.length > 20
                   ? `${partner.description.slice(0, 20)}...`
                   : partner.description}
               </p>
             </div>
           </div>
         ))}
       </div>
     </div>
   )}
 </div>
 {isSidebarOpen && (
   <div
     className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-30"
     onClick={toggleSidebar}
   ></div>
 )}
</div>
      )}
     

     <div
  className={`overflow-auto ${
    listSelectedCharacter.length > 0 
      ? 'sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5' 
      : 'w-full'
  }`}
  style={{ height: 'calc(100vh - 5rem)' }} // 5rem is the equivalent of h-20
> 
        <div className='flex '>
          <div className='flex w-full py-4 px-2 justify-center items-center  bg-[#363C43] gap-5'>

            {/* <img
              src="./image/Group.png"
              alt="logo"
              className='w-12'

            /> */}
            <div className='text-sm sm:text-md font-bold '>
              New App On IOS and Android, Tap To Joy !
            </div>
          </div>

        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 m-4 "

        >
        {combinedData.map((ScenarioChar, index) => {
  return (
    ScenarioChar && ScenarioChar.character && (
      <div key={index} className="relative flex flex-col rounded-lg overflow-hidden">
        {/* Background Gradient Image */}
        <div className="absolute inset-0">
          <img
            src="./image/backprint.jpg"
            alt="background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        {/* Blackish Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#342F66] via-[#4b2b61] to-[#4A0F58] mt-16"></div>

        {/* Content Section */}
        <div
          className="relative flex flex-col p-4 cursor-pointer"
          onClick={() =>
            handleCardClick(
              ScenarioChar.character.name,
              ScenarioChar.character.imageName,
              ScenarioChar.character.description,
              ScenarioChar.character.identity,
              ScenarioChar.topic,
              ScenarioChar.context,
              ScenarioChar.prompt,
              ScenarioChar.character.imageName // Assuming scenario.image was incorrect and meant character.imageName
            )
          }
        >
          {/* Top Section */}
          <div className="flex w-full gap-3 bg-transparent rounded-t-md">
            <div className="flex md:w-1/4 justify-start items-center">
              <div className="flex">
                <img
                  src={`./image/profiles/${ScenarioChar.character.imageName}`}
                  alt={ScenarioChar.character.imageName}
                  className="rounded-full w-20 h-20 object-fill"
                />
              </div>
            </div>
            <div className="md:w-3/4 text-white mt-4">
              <span className="text-lg font-semibold">{ScenarioChar.topic}</span>
              <p className="text-[#a2c5ff] font-sans font-medium italic mt-4 md:text-xs">
                {ScenarioChar.character.name}
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="rounded-b-md">
            <div>
              <div className="flex w-full text-white text-sm font-thin p-2">
                {/* Adjust text to fit within two lines */}
                <div className="line-clamp-2 font-sans font-medium">
                  {ScenarioChar.context}
                </div>
              </div>
            </div>
            <div className="flex py-2 justify-between">
              <div className="flex gap-2">
                <span>
                  <IoMdChatbubbles size={20} color="gray" />
                </span>
                <span className="text-xs text-gray-400">
                  {(Math.random() * (99 - 10) + 10).toFixed(1)}k
                </span>
              </div>
              <button className="flex items-center justify-center rounded-full font-bold text-xs text-white px-4 py-2 bg-gradient-to-b from-[#C702F5] to-[#2F9FFC]">
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
    </div>
  );
};

export default CharacterSelectionPage;

