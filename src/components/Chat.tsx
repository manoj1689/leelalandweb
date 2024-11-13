import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendChat } from '../services/ChatService';
import { IoChevronBack } from "react-icons/io5";
import { BsFillSendFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoDiamond } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";
import { getChatHistory } from '../services/ChatHistoryService'
const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const storedUserId = localStorage.getItem('user_id') || '';
  const [user_id] = useState<string>(storedUserId);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [message, setMessage] = useState<string>('');
  const [temperature] = useState<number>(0.7);
  const [error, setError] = useState<string>('');

  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Retrieve characterName and scenarioTopic from location state
  const location = useLocation();
  const { characterName, scenarioTopic, scenarioContext } = location.state || {};

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        if (characterName) {
          const data = await getChatHistory(characterName);
          setChatHistory(data);
        }
      } catch (err: any) {

        //  console.error(err);
      }
    };

    fetchChatHistory();
  }, [characterName]);  // When characterId changes, fetch the new chat history


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!characterName || !scenarioTopic) {
      setError('Character and Scenario are required');
      return;
    }

    const newChatHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newChatHistory);

    const chatData = {
      user_id,
      character_id: characterName,
      scenario_id: scenarioTopic,
      chat_history: newChatHistory,
      temperature,
    };

    try {
      const chatResponse:any = await sendChat(chatData);
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
      chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom when new message is added
    }
  }, [chatHistory]);
  console.log("chatHistory", chatHistory)
  return (
    <div className='flex w-full '>
      <div className="flex flex-col w-1/3 lg:w-1/4  bg-gray-800   max-h-screen overflow-y-auto  ">
        <div className=' text-3xl    '>
          <div className='flex justify-center py-8 items-center'>
            <img
              src="./image/AI.jpg"
              alt="logo"
              className='max-md:w-48 lg:max-w-64 xl:max-w-80 rounded-full border-2 p-4 border-gray-500'
            />
          </div>
          {characterName && scenarioTopic && scenarioContext ? (
            <div className="lg:w-4/5 mx-auto ">
              <div className='flex flex-col justify-center items-center'>
                <h2 className="text-xl font-semibold text-white">{characterName}</h2>
                <p className="text-sm font-normal text-gray-300">{scenarioTopic}</p>
              </div>
              <div className="mt-2 p-2 text-sm text-white font-charm font-medium">{scenarioContext}</div>
            </div>
          ) : (
            <p className="text-red-500 text-center font-semibold">Character or Scenario not selected</p>
          )}
        </div>
        <div className='w-full lg:w-4/5  xl:w-3/4 mx-auto p-4 space-y-3 '>

          <div className='flex gap-3 p-4 cursor-pointer' onClick={()=>navigate('/')}>
            <span> <BiSolidDashboard size={25} /></span><span className='text-lg font-bold'> DashBoard</span>

          </div>
          <div className='flex gap-3 p-4'>
            <span><IoDiamond size={25} /></span><span className='text-lg font-bold'> Popular</span>

          </div>
          <div className='flex gap-3 p-4'>
            <span><FaUserFriends size={25} /></span><span className='text-lg font-bold'> Add Partners</span>

          </div>
          <div className='flex gap-3 p-4'>
            <span><FaMessage size={25} /></span><span className='text-lg font-bold'> Messages</span>

          </div>
          <div className='flex gap-3 p-4'>
            <span><IoMdSettings size={25} /></span><span className='text-lg font-bold'> Settings</span>

          </div>
        </div>

      </div>
      <div className='flex flex-col w-2/3 lg:w-3/4 h-full'>
      <div className='flex bg-gray-700  py-2 w-full '>
      <div className='flex  cursor-pointer ' onClick={() => navigate("/")}>
          <IoChevronBack size={40} color='white' />
        </div>
          <div className='flex w-full justify-center items-center '>
          {characterName && scenarioTopic && scenarioContext ? (
            <div className="flex w-full">
              <div className='flex w-1/6 justify-center items-center '>
                <h2 className="text-lg font-semibold text-nowrap text-white">{characterName}</h2>
               
              </div>
             <div className='flex gap-3 w-5/6 justify-center items-center  '>
              <img src="./image/Group.png" alt="chat logo" />
             <p className="text-lg font-medium text-gray-300"> Current Topic <span className='font-bold'>{scenarioTopic}</span></p>
             </div>
            </div>
          ) : (
            <p className="text-red-500 text-center font-semibold">Character or Scenario not selected</p>
          )}
          </div>
      </div>
       
      <div
  id="chat-history"
  className="mt-2 p-4 h-full overflow-y-auto scroll-smooth"
  style={{ maxHeight: '72vh' }} // Set max height to screen height minus 300px
>
  {chatHistory
    .filter(entry => entry.role === 'user' || entry.role === 'assistant') // Filter out any other roles
    .map((entry, index) => (
      <div
        key={index}
        className={`flex items-center ${entry.role === 'user' ? 'justify-end' : 'justify-start'} my-2`}
      >
        {/* Conditionally render user or assistant icon */}
        {entry.role === 'assistant' && (
          <div className=" flex-shrink-0 mr-4">
            <img src="./image/AI.jpg" alt="Assistant" className="w-12 h-12 rounded-full" />
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`p-4 rounded-lg shadow-md ${
            entry.role === 'user' ? 'bg-stone-600 text-white font-medium' : 'bg-cyan-700 text-white font-medium'
          } max-w-2xl lg:max-w-3xl `}
        >
          <p>{entry.content}</p>
        </div>
        
        {/* User icon */}
        {entry.role === 'user' && (
          <div className="flex-shrink-0 ml-2">
            <img src="./image/Group.png" alt="User" className="w-12 h-12 rounded-full" />
          </div>
        )}
      </div>
    ))}
</div>

        {error && <div className="mt-4 p-4 bg-red-100 rounded-md text-red-700">{error}</div>}
        <form onSubmit={handleSendMessage} className="flex w-3/4 p-6 my-2.5 bg-gray-800  fixed bottom-0">
          <div className="w-full">
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 w-full text-black"
              placeholder="Type your message here..."
              autoComplete="off"
            />
          </div>
          <div className='flex justify-center items-center'>
            <button
              type="submit"
              className=" bg-transparent text-white font-semibold  px-4"
            >
              <BsFillSendFill size={30} color='gray' />
            </button>
          </div>
        </form>
      </div>


    </div>

  );
};

export default ChatPage;




