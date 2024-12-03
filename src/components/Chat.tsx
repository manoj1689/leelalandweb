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
import { HiLightBulb } from "react-icons/hi";
import { getChatHistory } from '../services/ChatHistoryService';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface TextWithQuotesProps {
  text: string;
}


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

  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Retrieve characterName and scenarioTopic from location state
  const location = useLocation();
  const { characterName,characterImage,characterDescription ,characterIdentity,scenarioPrompt,scenarioImage,scenarioTopic, scenarioContext } = location.state || {};
  console.log("character",location.state.characterDescription )
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

const TextScenario: React.FC<TextWithQuotesProps> = ({ text }) => {
  // Function to style quoted text as white and the rest as gray
  const styledText = text.split(/(["'`][^"'"`]*["'`])/g).map((part, index) =>
    part.match(/(["'`][^"'"`]*["'`])/)
      ? <span key={index} className="text-white">{part}</span>
      : <span key={index} className="text-orange-300 italic">{part}</span>
  );

  return <div>{styledText}</div>;
};

const TextChat: React.FC<TextWithQuotesProps> = ({ text }) => {
  // Function to style quoted text as white and the rest as gray
  // Detects text wrapped in * and makes it italic
  const styledText = text.split(/(\*[^*]+\*)/g).map((part, index) => {
    // Check if the part is wrapped in asterisks, and apply italic style
    if (part.match(/\*[^*]+\*/)) {
      return <span key={index} className="italic text-orange-300">{part.replace(/\*/g, '')}</span>; // Remove asterisks and apply italic
    } else if (part.match(/(["'`][^"'"`]*["'`])/)) {
      // If it's quoted text, apply white color
      return <span key={index} className="text-white ">{part}</span>;
    } else {
      // Otherwise, apply gray color to the non-quoted parts
      return <span key={index} className="text-white">{part}</span>;
    }
  });

  return <div>{styledText}</div>;
};



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
      const chatResponse: any = await sendChat(chatData);
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
console.log("chat history",chatHistory)
  useEffect(() => {
    const chatContainer = document.getElementById('chat-history');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom when new message is added
    }
  }, [chatHistory]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
        <button
          className="sm:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded-lg"
          onClick={toggleSidebar}
        > 
          {isSidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
        <div className="sm:hidden fixed top-4 left-16 z-50  text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#0096FF] to-[#E407EC] p-2 ">
          Leela Land
        </div>
      {/* Sidebar Section */}
      <div
        className={`fixed sm:static  top-20 z-50 bg-[#141b23] transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 h-screen overflow-y-auto w-72 sm:w-2/5 md:w-1/3 lg:w-1/4 2xl:w-1/5`}
      >
        <div className="text-3xl">
          <div className="flex w-full justify-center p-4 items-center">
            <img
                     src={`./image/profiles/${characterImage}`}
              alt="logo"
              className="w-full  rounded-xl"
            />
          </div>
          {characterName && characterDescription  &&characterIdentity ? (
            <div className="w-full">
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-white">{characterName}</h2>
                <p className="text-sm font-medium text-gray-300 p-2 italic">{characterIdentity}</p>
              </div>
              <div className="mt-2 p-2 text-sm text-white font-charm font-medium">{characterDescription }</div>
            </div>
          ) : (
            <p className="text-red-500 text-center font-semibold">Character or Scenario not selected</p>
          )}
        </div>
        <div className="w-full  mx-auto p-4 space-y-3">
          <div className="flex gap-3 p-4 cursor-pointer" onClick={() => navigate('/')}>
            <BiSolidDashboard size={25} />
            <span className="text-lg font-bold">DashBoard</span>
          </div>
          <div className="flex gap-3 p-4">
            <IoDiamond size={25} />
            <span className="text-lg font-bold">Popular</span>
          </div>
          <div className="flex gap-3 p-4">
            <FaUserFriends size={25} />
            <span className="text-lg font-bold">Add Partners</span>
          </div>
          <div className="flex gap-3 p-4">
            <FaMessage size={25} />
            <span className="text-lg font-bold">Messages</span>
          </div>
          <div className="flex gap-3 p-4">
            <IoMdSettings size={25} />
            <span className="text-lg font-bold">Settings</span>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      {/* <div className="flex flex-col w-full sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5 " > */}
      <div className=" w-full sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5 " 
       
      > 
        <div className="flex  bg-[#363c43] py-2 gap-2 w-full">
          <div className="flex cursor-pointer" onClick={() => navigate('/')}>
            <IoChevronBack size={40} color="white" />
          </div>
          <div className="flex w-full justify-center items-center">
            {characterName && scenarioTopic && scenarioContext ? (
              <div className="flex w-full">
                <div className="flex w-1/3 sm:w-1/6  justify-center items-center">
                  <h2 className="text-lg font-semibold text-nowrap text-white">{characterName}</h2>
                </div>
                <div className="flex gap-3 w-2/3 sm:w-5/6 justify-center items-center">
                  <img src="./image/Group.png" alt="chat logo" className='w-12' />
                  <p className="text-sm md:text-md md:text-lg font-medium text-gray-300">
                    Current Topic <span className=" text-sm md:text-md md:text-lg  font-bold">{scenarioTopic}</span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-center font-semibold">Character or Scenario not selected</p>
            )}
          </div>
        </div>

        <div
          id="chat-history"
          className="mt-2 pt-8 pb-20 lg:pb-12 px-4 overflow-y-auto scroll-smooth"
          style={{ height: 'calc(100vh - 19rem)' }} // 5rem is the equivalent of h-20
        >
          <div className='  w-full bg-sky-700 text-md text-white p-4 rounded-lg'>
            <div className='font-bold'>
              Scenario :-
            </div>
            <div>
            < TextScenario text={scenarioPrompt} /> 
            </div>
            <div className='p-4 '>
              <img src="./image/Scenarios/scenario1.webp" alt="Scenario-1" className='w-72 rounded-lg' />
            </div>
            {/* {scenarioImage} */}
          </div>
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
                className={`p-4 rounded-lg shadow-md ${
                  entry.role === 'user' ? 'bg-[#655762] text-white' : 'bg-[#3A5470] text-white'
                } max-w-2xl`}
              >
                {/* <p><TextChat text={entry.content} /> </p> */}
                <p>{entry.content} </p>
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
          <HiLightBulb size={50}/>
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
