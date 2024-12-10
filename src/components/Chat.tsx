import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendChat } from '../services/ChatService';
import { IoMdArrowRoundBack } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoDiamond } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";
import { HiLightBulb } from "react-icons/hi";
import { getChatHistory } from '../services/ChatHistoryService';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";

interface TextWithQuotesProps {
  text: string;
}


const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const storedUserId = localStorage.getItem('user_id') || '';
  const [user_id] = useState<string>(storedUserId);
  const [user, setUser] = useState<{ sub: string; picture: string } | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [message, setMessage] = useState<string>('');
  const [temperature] = useState<number>(0.7);
  const [error, setError] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Manage sidebar visibility
  const [loading, setLoading] = useState<boolean>(false)
  const accessToken = localStorage.getItem('access_token');
  useEffect(() => {
    if (accessToken) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [accessToken]);


  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Retrieve characterName and scenarioTopic from location state
  const location = useLocation();
  const { characterName, characterImage, characterDescription, characterIdentity, scenarioPrompt, scenarioImage, scenarioTopic, scenarioContext } = location.state || {};
  // console.log("character", location.state.characterDescription)
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
      setLoading(true)
      const chatResponse: any = await sendChat(chatData);
      setLoading(false)
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'assistant', content: chatResponse.reply.content },
      ]);
      setMessage('');
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to send msg');
    }
  };
  console.log("chat history", chatHistory)
  useEffect(() => {
    const chatContainer = document.getElementById('chat-history');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom when new message is added
    }
  }, [chatHistory]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
      <div className='fixed top-0  flex w-full bg-[#141b23]  h-20 items-center '>
        <div className='flex w-[90%]  gap-10 mx-auto py-2 '>
          <div className='flex  gap-5 justify-center items-center'>
            <div className="flex cursor-pointer" onClick={() => navigate(-1)}>
              <IoMdArrowRoundBack size={28} color="white" />
            </div>
            <div className="flex ">
              {characterName ? (
                <div className="flex w-full">
                  <h2 className="text-xl font-bold text-nowrap text-white">{characterName}</h2>
                </div>
              ) : (
                <p className="text-red-500 text-center font-semibold">Character missing.</p>
              )}
            </div>
            <div>
              <button onClick={toggleSidebar}>{isSidebarOpen ? <MdArrowDropUp size={40} /> : <MdArrowDropDown size={40} />}</button>
            </div>
          </div>
          <div className='flex w-full'></div>

          <div className="flex  justify-center items-center ">

            <button
              onClick={() => navigate("/settings")}
              className='flex p-4 bg-slate-700 rounded-full justify-center items-center'
            >
              <div >
                <FaUserLarge size={20} />
              </div>
            </button>
          </div>
        </div>


      </div>
      {/* Sidebar Section */}
      <div
        className={`fixed sm:static  top-20 z-50 bg-[#141b23] transition-transform transform ${isSidebarOpen ? 'translate-x-0 w-64 sm:w-2/5 md:w-1/3 lg:w-1/4 2xl:w-1/5' : 'w-0 -translate-x-full'
          }  h-screen overflow-y-auto `}
      >
        <div className="text-3xl">
          <div className="flex w-full justify-center p-4 items-center">
            <img
              src={`./image/profiles/${characterImage}`}
              alt="logo"
              className="w-full  rounded-xl"
            />
          </div>
          {characterName && characterDescription && characterIdentity ? (
            <div className="w-full">
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-white">{characterName}</h2>
                <p className="text-sm font-medium text-gray-300 p-2 italic">{characterIdentity}</p>
              </div>
              <div className="mt-2 p-2 text-sm text-white font-charm font-medium">{characterDescription}</div>
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
      <div className={` w-full   ${isSidebarOpen ? "sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5" : " w-full"} `}

      >
        <div className="flex  bg-[#363c43]  gap-2 w-full h-16">

          <div className="flex  w-full  px-2 justify-center items-center">
            {characterName && scenarioTopic && scenarioContext ? (


              <div className="flex gap-3 ">
                <img src="./image/Group.png" alt="chat logo" className='w-8 rounded-lg' />
                <p className="text-sm md:text-md md:text-lg font-medium text-gray-300">
                  Current Topic <span className=" text-sm md:text-md md:text-lg  font-bold">{scenarioTopic}</span>
                </p>
              </div>

            ) : (
              <p className="text-red-500 text-center font-semibold">Character or Scenario not selected</p>
            )}
          </div>
        </div>

        <div
          id="chat-history"
          className="mt-2 pt-8 pb-20 lg:pb-12 px-4  overflow-y-auto scroll-smooth"
          style={{ height: 'calc(100vh - 19rem)' }} // 5rem is the equivalent of h-20
        >

          <div className='container mx-auto  w-full bg-sky-700 text-md text-white p-4 rounded-lg'>
            <div className='font-bold'>
              Scenario :-
            </div>
            <div>
              {/* < TextScenario text={scenarioPrompt} /> */}
              <p>{scenarioPrompt} </p>
            </div>
            <div className='p-4 '>
              <img src="./image/Scenarios/scenario1.webp" alt="Scenario-1" className='w-72 rounded-lg' />
            </div>
            {/* {scenarioImage} */}
          </div>
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className={`flex container mx-auto items-start ${entry.role === 'user' ? 'justify-end' : 'justify-start'} my-4`}
            >
              {entry.role === 'assistant' && (
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={`./image/profiles/${characterImage}`}
                    alt="Assistant"
                    className="w-14 rounded-full"
                  />
                </div>
              )}
              <div
                className={`p-4 rounded-lg shadow-md ${entry.role === 'user' ? 'bg-[#655762] text-white' : 'bg-[#3A5470] text-white'} max-w-2xl`}
              >
                <p className="">
                  {index === chatHistory.length - 1 ? (
                    // Apply the animation only for the last message
                    entry.content.split(' ').map((word, wordIndex) => (
                      <span key={wordIndex} className="word" style={{ display: 'inline-block' }}>
                        {word.split('').map((char, charIndex) => (
                          <span
                            key={charIndex}
                            className="letter"
                            style={{ animationDelay: `${(wordIndex * 0.3 + charIndex * 0.03)}s` }}
                          >
                            {char}
                          </span>
                        ))}
                        <span>&nbsp;</span> {/* To preserve space between words */}
                      </span>
                    ))
                  ) : (
                    // Display content normally for all other messages
                    <span>{entry.content}</span>
                  )}
                </p>
              </div>
              {entry.role === 'user' && (
                <div className="flex-shrink-0 ml-2">
                  {/* Background Div */}
                  <div
                    className="rounded-full w-14 h-14 p-2 flex items-center justify-center"
                    style={{ background: 'linear-gradient(180deg,#585bdb,#6365e0,#8f48a5)' }}
                  >
                    {/* Image Div */}
                    <div className="w-8 h-8">
                      <img
                        src="./image/chat.png"
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}



          {/* Loading dots */}
          {loading && (
            <div className="flex container mx-auto items-start justify-start my-4">
              <div className="flex-shrink-0 mr-4">
                <img
                  src={`./image/profiles/${characterImage}`}
                  alt="Assistant"
                  className="w-14 rounded-full"
                />
              </div>
              <div className="p-4 items-start">
                {/* Loading dots at the top */}
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className="animate-wave text-pink-700"
                    style={{ fontSize: '70px', animationDelay: '0s' }}
                  >
                    •
                  </span>
                  <span
                    className="animate-wave text-pink-700"
                    style={{ fontSize: '70px', animationDelay: '0.4s' }}
                  >
                    •
                  </span>
                  <span
                    className="animate-wave text-pink-700 "
                    style={{ fontSize: '70px', animationDelay: '0.6s' }}
                  >
                    •
                  </span>
                </div>

                {/* Rest of the content */}
              </div>
            </div>
          )}



        </div>
        <div className='flex'>
          {error && <div className="sm:m-4 p-4 bg-red-100 rounded-md text-red-700">{error}</div>}
        </div>

      </div>
      {/* chat input box */}
      <div>


        <form onSubmit={handleSendMessage} className={`flex flex-col bg-[#141b23]    ${isSidebarOpen ? "w-full sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5" : " w-full"}  fixed bottom-0 right-0  sm:z-50`}>
          <div className="flex flex-col justify-between items-center p-2">
            <div >
              To make your conversation more personal
            </div>
            <div className="text-md text-bold text-transparent bg-clip-text bg-gradient-to-b from-[#0096FF] to-[#E407EC]">
              Set your role here
            </div>
          </div>
          <div className='flex  bg-stone-800 p-4 '>
            <div className='flex container mx-auto w-full'>
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

          </div>

        </form>
      </div>
    </div>
  );
};

export default ChatPage;
