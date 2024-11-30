import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendChatPartner } from '../services/ChatPartnerService';

import { IoChevronBack } from "react-icons/io5";
import { BsFillSendFill } from "react-icons/bs";
import { getScenarios } from '../services/SenarioService';
import { HiLightBulb } from "react-icons/hi";
import { getChatHistory } from '../services/ChatHistoryService';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const storedUserId = localStorage.getItem('user_id') || '';
  const [user_id] = useState<string>(storedUserId);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [message, setMessage] = useState<string>('');
  const [temperature] = useState<number>(0.7);
  const [error, setError] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Manage sidebar visibility
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>("General chat")


  const location = useLocation();
  const { partner } = location.state || {};
  const partnerImage = partner.image
  const characterName = partner.name
  const partnerPersonality = partner.personality
  const partnerContext = partner.description
  const characterImage = partner.image
  //console.log("partner at chat partner page",partner)

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        if (characterName) {
          const data = await getChatHistory(characterName);
          setChatHistory(data);
        }
      } catch (err: any) {
        // Handle error silently
      }
    };

    fetchChatHistory();
  }, [characterName]);

  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scenarioData = await getScenarios();
        setScenarios(scenarioData);
      } catch (error: any) {
        setError('Failed to load characters or scenarios');
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!characterName) {
      setError('Character is required');
      return;
    }
  
    const newChatMessage = { role: 'user', content: message };
    const newChatHistory = [...chatHistory, newChatMessage];
    setChatHistory(newChatHistory);
  
    const chatData = {
      user_id,
      character_id: characterName,
      scenario_id: selectedScenario,
      chat_history: newChatHistory,
      temperature,
    };
  
    try {
      const chatResponse: any = await sendChatPartner(chatData);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'assistant', content: chatResponse.reply.content },
      ]);
      setMessage('');
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to send message');
    }
  };
  

  useEffect(() => {
    const chatContainer = document.getElementById('chat-history');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom when a new message is added
    }
  }, [chatHistory]);

  const handleScenarioChange = (newScenario: string) => {
    setSelectedScenario(newScenario);
    // setChatHistory([]); // Clear chat history to start a new chat
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

console.log("chat hisory",chatHistory)
  return (
    <div className="flex w-full">
      <button
        className="sm:hidden fixed top-4 left-4 z-50 text-white bg-[#1E2C3B] p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>
      <div className="sm:hidden fixed top-4 left-16 z-50 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#0096FF] to-[#E407EC] p-2 ">
        Leela Land
      </div>
      {/* Sidebar Section */}
      <div
        className={`fixed sm:static  top-20 z-50 bg-[#1E2C3B] transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 h-screen overflow-y-auto w-72 sm:w-2/5 md:w-1/3 lg:w-1/4 2xl:w-1/5`}
      >
        <div className="text-3xl">
          <div className="flex w-full justify-center p-4 items-center">
            <img
              src={`./AvatarsImage/${partnerImage}`}
              alt={partnerImage}
              className="w-full  rounded-xl"
            />
          </div>
          {characterName && partnerPersonality && partnerContext ? (
            <div className=" mx-auto">
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-white">{characterName}</h2>
                <p className="text-sm font-normal text-gray-300">{partnerPersonality}</p>
              </div>
              <div className="mt-2 p-4 text-sm text-white font-charm font-medium">{partnerContext}</div>
            </div>
          ) : (
            <p className="text-red-500 text-center font-semibold">Character or Scenario not selected</p>
          )}
        </div>
        <div className="w-full mx-auto p-4  space-y-3">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 shadow-md transition bg-gradient-to-b ${selectedScenario === scenario.topic
                  ? "from-orange-500 to-blue-500 "
                  : "from-pink-500 to-blue-500"
                }  cursor-pointer`}
                onClick={() =>  handleScenarioChange(scenario.topic)}
            >


              {/* Display Scenario Topic */}
              <h2 className="text-xl font-bold text-white">{scenario.topic}</h2>

              {/* Display Category and Difficulty */}
              <p className="text-sm text-gray-200">
                <span className="font-medium">Category:</span> {scenario.category} |
                <span className="font-medium"> Difficulty:</span> {scenario.difficulty}
              </p>



              {/* Display Prompt */}
              <blockquote className="border-l-4 border-sky-500 pl-4 italic mt-2">
                {/* Display Context */}
                <p className="text-gray-300 mt-2">{scenario.context}</p>
              </blockquote>
            </div>
          ))}
        </div>

      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5  h-full">
        <div className="flex  bg-[#363c43] py-2 gap-2 w-full">
          <div className="flex cursor-pointer" onClick={() => navigate('/')}>
            <IoChevronBack size={40} color="white" />
          </div>
          <div className="flex w-full justify-center items-center">
            {characterName && partnerPersonality && partnerContext ? (
              <div className="flex w-full">
                <div className="flex w-1/3 sm:w-1/6  justify-center items-center">
                  <h2 className="text-lg font-semibold text-nowrap text-white">{characterName}</h2>
                </div>
                <div className="flex gap-3 w-2/3 sm:w-5/6 justify-center items-center">
                  <img src="./image/Group.png" alt="chat logo" className='w-12' />
                  <p className="text-sm md:text-md md:text-lg font-medium text-gray-300">
                    Current Topic <span className=" text-sm md:text-md md:text-lg  font-bold">{partnerPersonality}</span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-center font-semibold">Character not selected</p>
            )}
          </div>
        </div>

        <div
          id="chat-history"
          className="mt-2 pt-8 pb-20 lg:pb-12 px-4 overflow-y-auto scroll-smooth"
          style={{ height: 'calc(100vh - 19rem)' }} // 5rem is the equivalent of h-20
        >
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center ${entry.role === 'user' ? 'justify-end' : 'justify-start'} my-2`}
            >
              {entry.role === 'assistant' && (
                <div className="flex-shrink-0 mr-4">
                  <img src="./image/AI.jpg" alt="Assistant" className="w-12 h-12 rounded-full" />
                </div>
              )}
              <div
                className={`p-4 rounded-lg shadow-md ${entry.role === 'user' ? 'bg-stone-600 text-white' : 'bg-cyan-700 text-white'
                  } max-w-2xl`}
              >
                <p>{entry.content}</p>
              </div>
              {entry.role === 'user' && (
                <div className="flex-shrink-0 ml-2">
                  <img src="./image/Group.png" alt="User" className="w-16  " />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='flex'>
          {error && <div className="sm:m-4 p-4 bg-red-100 rounded-md text-red-700">{error}</div>}
        </div>

      </div>
      {/* chat input box */}
      <div>


        <form onSubmit={handleSendMessage} className="flex flex-col bg-[#141b23]   w-full sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5  fixed bottom-0 right-0  sm:z-50">
          <div className='flex flex-col justify-between items-center p-2'>
            <div >
              To make your conversation more personal
            </div>
            <div className="text-md text-bold text-transparent bg-clip-text bg-gradient-to-b from-[#0096FF] to-[#E407EC]">
              Set your role here
            </div>
          </div>
          <div className='flex  bg-stone-800 p-4 '>
            <div className='px-2 text-orange-300 opacity-70' >
              <HiLightBulb size={50} />
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 w-full text-slate-800 focus:outline-none rounded-lg "
              placeholder="Type your message here..."
              autoComplete="off"
            />
            <button type="submit" className="pl-4">
              <BsFillSendFill size={30} color="gray" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChatPage;