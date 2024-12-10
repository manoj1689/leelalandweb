import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdChatbubbles } from "react-icons/io";
import { getCharacters } from "../services/CharacterService";
import { getScenarios } from "../services/SenarioService";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Character, Scenario, CombinedData } from "../interfaces/interfaces";
import { FaUserLarge } from "react-icons/fa6";

const SearchCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const characterData = await getCharacters();
        const scenarioData = await getScenarios();
        setCharacters(characterData);
        setScenarios(scenarioData);
      } catch (error: any) {
        setError("Failed to load characters or scenarios");
      }
    };

    fetchData();
  }, []);

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
            : null;
        })
        .filter(Boolean) as CombinedData[]
    );
  };

  const combinedData = combineScenariosAndCharacters(scenarios, characters);

  const titles = [
    "All",
    "Confident",
    "Elegant",
    "Bold",
    "Gentle",
    "Sophisticated",
    "Determined",
    "Playful",
    "Timeless",
    "Vibrant",
    "Glamorous",
    "Charming",
    "Resilient",
    "Spirited",
    "Assertive",
    "Nurturing",
    "Beachy",
    "Romantic",
    "Adventurous",
    "Stylish",
    "Dreamy",
  ];

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

    const userId = localStorage.getItem("user_id");
    const userCharactersKey = `selected_characters_${userId}`;
    const selectedCharacters = JSON.parse(
      localStorage.getItem(userCharactersKey) || "[]"
    );

    const characterExists = selectedCharacters.some(
      (selectedCharacter: any) =>
        selectedCharacter.characterName === character.characterName &&
        selectedCharacter.characterDescription ===
        character.characterDescription &&
        selectedCharacter.scenarioTopic === character.scenarioTopic
    );

    const token = localStorage.getItem("access_token");

    if (token) {
      if (!characterExists) {
        selectedCharacters.push(character);
        localStorage.setItem(
          userCharactersKey,
          JSON.stringify(selectedCharacters)
        );
      }
      navigate("/chat", { state: character });
    } else {
      setError("Please login to load data!!");
    }
  };

  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle filter option change
  const handleFilterChange = (option: string) => {
    setFilterOption(option);
  };

  // Filter combinedData based on searchQuery and filterOption
  const filteredData = combinedData.filter((item) => {
    const matchesFilter =
      filterOption === "" || item.character.description.includes(filterOption);
    const matchesSearch =
      searchQuery === "" ||
      item.character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className='w-full flex fixed top-0 h-20 '>
        <div className="flex w-[90%] gap-10 mx-auto">
          <div className="flex   ">
            <div className="flex w-full gap-5  items-center ">
              <div>
              <IoMdArrowRoundBack  size={28} color="white"  onClick={() => navigate(-1)} className="cursor-pointer" />
              </div>
              <div className="max-sm:hidden">
                <h2 className="text-xl font-bold text-nowrap text-white">Search</h2>
              </div>
            </div>

          </div>

          {/* Search Bar */}
          <div className=" w-full flex py-4 justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Your AI Partner.."
              className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full "
            />
          </div>

          <div className="flex justify-center items-center  ">
            <div>
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


      </div>

      <div className='w-full overflow-y-auto' style={{ height: 'calc(100vh - 5rem)' }}>
        <div className='flex'>
          <div className='flex w-full h-16 px-2 justify-center items-center bg-[#363C43] gap-5'>
            <img src="./image/Group.png" alt="logo" className='w-8' />
            <div className='text-sm sm:text-md font-bold'>
              New App On IOS and Android, Tap To Joy !
            </div>
          </div>
        </div>



        {/* Filter Options */}
        <div className="container mx-auto flex flex-wrap max-h-60 overflow-y-auto justify-center gap-4 my-4 p-4">
          {titles.map((title, index) => (
            <button
              key={index}
              onClick={() => handleFilterChange(title === "All" ? '' : title)}
              className={`px-4 py-2 hover:bg-gradient-to-b from-[#342F66] via-[#4b2b61] to-[#4A0F58] rounded ${filterOption === title ? 'bg-gradient-to-b from-[#342F66] via-[#4b2b61] to-[#4A0F58]' : (title === "All" ? 'bg-[#6f3f7a]' : 'bg-stone-900')} text-white`}
            >
              {title}
            </button>
          ))}
        </div>

        {/* Filtered Data */}
        <div className="container mx-auto flex flex-col gap-4 my-4 p-4">
          {filteredData.map((ScenarioChar, index) =>
            ScenarioChar && ScenarioChar.character && (
              <div key={index} className="relative flex flex-col rounded-lg overflow-hidden">
                {/* Background Gradient Image */}
                {/* <div className="absolute inset-0">
                  <img
                    src="./image/backprint.jpg"
                    alt="background"
                    className="w-full h-full object-cover opacity-10"
                  />
                </div> */}

                {/* Blackish Overlay */}
                {/* <div className="absolute inset-0 bg-transparent"></div> */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#342F66] via-[#4b2b61] to-[#4A0F58]"></div>

                {/* Content Section */}
                <div
                  className="relative flex flex-col sm:flex-row p-4 items-center cursor-pointer"
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
                  {/* Left Section */}
                  <div className="flex w-full sm:w-3/4 gap-3 bg-transparent">
                    <div className="flex w-1/4 md:w-1/6 justify-center items-center">
                      <img
                        src={`./image/profiles/${ScenarioChar.character.imageName}`}
                        alt={ScenarioChar.character.imageName}
                        className="rounded-full w-20 h-20 object-fill"
                      />
                    </div>
                    <div className="text-white w-3/4 md:w-5/6">
                      <span className="text-lg font-semibold"> {ScenarioChar.topic}</span>
                      <p className="text-[#a2c5ff] font-sans font-medium italic md:text-xs">
                        {ScenarioChar.character.name}
                      </p>
                      <div className="flex w-full text-white text-sm font-thin">
                        <div className="line-clamp-2 font-sans font-medium">
                          {ScenarioChar.context}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="w-full  sm:w-1/4 ">
                    <div className="flex sm:flex-col lg:flex-row gap-4 justify-around items-center py-2">
                      <div className="flex w-full gap-2 justify-center  ">
                        <span><IoMdChatbubbles size={20} color='gray' /></span>
                        <span className="text-xs text-gray-400">
                          {(Math.random() * (99 - 10) + 10).toFixed(1)}k
                        </span>
                      </div>
                      <div className="flex w-full justify-center">
                        <button className="flex items-center justify-center rounded-full font-bold text-xs text-white px-4 py-2 bg-gradient-to-b from-[#C702F5] to-[#2F9FFC]">
                          Chat Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchCharacterPage;

