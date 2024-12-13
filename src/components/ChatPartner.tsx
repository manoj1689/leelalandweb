import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendChatPartner } from '../services/ChatPartnerService';

import { IoChevronBack } from "react-icons/io5";
import { BsFillSendFill } from "react-icons/bs";
import { getScenarios } from '../services/SenarioService';
import { HiLightBulb } from "react-icons/hi";
import { getChatHistory } from '../services/ChatHistoryService';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUserLarge } from "react-icons/fa6";

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
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>("General chat")
  const [selectedScenarioPrompt, setSelectedScenarioPrompt] = useState<any>("General talking scenario not mention")
  const [newScenarioImage,setNewScenarioImage]=useState<String>("generalChat.png")
  const [loading, setLoading] = useState<boolean>(false)
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
  const TextScenario: React.FC<TextWithQuotesProps> = ({ text }) => {
    // Function to style text based on specific patterns
    const styledText = text.split(/(\*\*[^*]+\*\*|#.*?#|\*[^*]+\*)/g).map((part, index) => {
      if (part.match(/^\*\*[^*]+\*\*$/)) {
        // Match expressions (e.g., **expression**) and style them white
        return (
          <span key={index} className="text-slate-400 font-semibold  ">
            *{part.replace(/\*\*/g, '')}*
          </span>
        );
      } else if (part.match(/^#.*?#$/)) {
        // Match bold text (e.g., # bold #) and style it bold
        return (
          <span key={index} className="font-medium">
            {part.replace(/#/g, '')}
          </span>
        );
      } else if (part.match(/^\*[^*]+\*$/)) {
        // Match environmental text (e.g., *description*) and style it gray + cursive
        return (
          <span key={index} className="text-gray-500 italic">
            {part.replace(/\*/g, '')}
          </span>
        );
      } else {
        // Default text styling for other content
        return (
          <span key={index} className="text-white">
            {part}
          </span>
        );
      }
    });

    return <div>{styledText}</div>;
  };

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
      setLoading(true)
      const chatResponse: any = await sendChatPartner(chatData);
      setLoading(false)

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

console.log("selected Scenario",selectedScenario)
  useEffect(() => {
    const chatContainer = document.getElementById('chat-history');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom when a new message is added
    }
  }, [chatHistory]);

  const handleScenarioChange = (newScenario: string, newScenarioPromt: string,newScenarioImage:string) => {
    setSelectedScenario(newScenario);
    setSelectedScenarioPrompt(newScenarioPromt)
    setNewScenarioImage(newScenarioImage)
    // setChatHistory([]); // Clear chat history to start a new chat
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  console.log("chat hisory", newScenarioImage)
  return (
    <div className="flex w-full">
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
              src={`./AvatarsImage/${partnerImage}`}
              alt={partnerImage}
              className="w-full   rounded-xl"
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
              onClick={() => handleScenarioChange(scenario.topic, scenario.prompt,scenario.image)}
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
      <div className={` w-full   ${isSidebarOpen ? "sm:w-3/5 md:w-2/3 lg:w-3/4 2xl:w-4/5" : " w-full"} `}>
        <div className="flex  bg-[#363c43]  gap-2 w-full h-16">
          {characterName && partnerPersonality && partnerContext ? (

            <div className="flex w-full gap-3 justify-center items-center">
              <img src="./image/Group.png" alt="chat logo" className='w-8' />
              <p className="text-sm md:text-md md:text-lg font-medium text-gray-300">
                Current Topic <span className=" text-sm md:text-md md:text-lg  font-bold">{partnerPersonality}</span>
              </p>
            </div>

          ) : (
            <p className="text-red-500 text-center font-semibold">Character not selected</p>
          )}

        </div>

        <div
          id="chat-history"
          className="mt-2 pt-8 pb-20 lg:pb-12 px-4 overflow-y-auto scroll-smooth"
          style={{ height: 'calc(100vh - 19rem)' }} // 5rem is the equivalent of h-20

        >
          <div className='container mx-auto  w-full bg-[#291f2b]  p-4 rounded-lg'>
            <div className='font-bold'>
              Scenario :-{selectedScenario}
            </div>
            <div>
              <p> < TextScenario text={selectedScenarioPrompt} /></p>
             
              {/* <p>{selectedScenarioPrompt} </p> */}
            </div>
            <div className='p-4 '>
              <img src={`./image/Scenarios/${newScenarioImage}.webp`} alt="Scenario-1" className='w-72 rounded-lg' />
            </div>
          </div>
          <div className='container mx-auto'>
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={`flex container mx-auto items-start ${entry.role === 'user' ? 'justify-end' : 'justify-start'} my-4`}
              >
                {entry.role === 'assistant' && (
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={`./AvatarsImage/${partnerImage}`}
                      alt={partnerImage}
                      className="w-12 h-12 rounded-full  object-cover" 
                    />
                  </div>
                )}
               <div
                className={`p-4 rounded-lg shadow-md ${entry.role === 'user' ? 'bg-[#655762] text-white' : 'bg-[#26384b] text-white'} max-w-2xl`}
              >
                  <p>
                  {/* {index === chatHistory.length - 1 ? (
                    
                    entry.content.split(' ').map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="word"
                        style={{
                          display: 'inline-block',
                          animation: 'fadeIn 0.5s ease forwards', 
                          animationDelay: `${wordIndex * 0.1}s`, 
                          opacity: 0,
                        }}
                      >
                        {word}
                        <span>&nbsp;</span>
                      </span>
                    ))
                  ) : (
                 
                    <span><TextScenario text={entry.content}/></span>
                  )} */}
                <TextScenario text={entry.content}/>
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
                      src={`./AvatarsImage/${partnerImage}`}
                      alt={partnerImage}
                      className="w-12 h-12 rounded-full  object-cover" 
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