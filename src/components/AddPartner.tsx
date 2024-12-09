import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { addPartner, PartnerRequest } from "../services/PatnerService";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 3,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

interface ModalPageProps {
    closeModal: () => void; // Function to close the modal
}

const ModalPage: React.FC<ModalPageProps> = ({ closeModal }) => {
    const [name, setName] = useState("");
    const [preference, setPreference] = useState("");
    const [personality, setPersonality] = useState("");
    const [showAll, setShowAll] = useState(false); // Controls visibility of extra options
    const [age, setAge] = useState(19); // Default age set to 19
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const items = [
        "Teen", "Housewife", "Worker", "Bhabhi Ji", "Fans",
        "School Girl", "Teacher", "Doctor", "Nurse", "Lawyer",
        "Scientist", "Artist", "player", "Chef", "Athlete",
        "Model", "Social Worker", "Writer", "Police Officer", "Engineer"
    ];

    const images = [
        'image1.png',
        'image2.png',
        'image3.png',
        'image4.png',
        'image5.png',
        'image6.png',
        'image7.png',
        'image8.png',
        'image9.png',
        'image10.png',
        'image11.png',
        'image12.png',
        'image13.png',
        'image14.png',
        'image15.png',
        'image16.png',
        'image17.png',
        'image18.png',
        'image19.png',
        'image20.png',
    ];

    const handleSubmit = async () => {
        const partnerData: PartnerRequest = {
            name,
            preference,
            personality,
            age,
            description,
            image,
        };

        try {
            const response = await addPartner(partnerData);
            console.log("Partner added successfully:", response);
            // alert("Partner added successfully!");

            // Reset all fields
            setName("");
            setPreference("");
            setPersonality("");
            setAge(19);
            setDescription("");

            // Close the modal
            closeModal();

            // Reload the page
            window.location.reload();
        } catch (error: any) {
            console.error("Error adding partner:", error.message);
            alert(`Error: ${error.message}`);
        }
    };

    // Slice the items based on the "showAll" state
    const displayedItems = showAll ? items : items.slice(0, 8); // Show only 8 items initially

    // Toggle between "More" and "Less"
    const handleToggle = () => {
        setShowAll(!showAll);
    };

    const handleSliderChange = (value: number | number[]) => {
        setAge(Array.isArray(value) ? value[0] : value); // If it's an array, use the first value
    };

    return (
        <div className="flex w-full flex-col p-4 rounded-lg shadow-md shadow-violet-950" style={{ background: 'linear-gradient(180deg, #3e1e46, #1a1b3e)' }}>
            <div className="flex justify-center items-center w-full font-bold text-2xl">
                Add Partner
            </div>

            <div className="flex flex-col md:flex-row">
                {/* First Div: Carousel */}
                <div className="w-full md:w-1/2 p-4">
                    <div className="h-96">
                        <h2 className="text-xl font-semibold mb-4">*Choose Avatars</h2>
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
                            // removeArrowOnDeviceType={["tablet", "mobile"]}
                        >
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="flex p-4 justify-center items-center rounded-lg"
                                    onClick={() => setImage(images[index])} // Set the image when clicked
                                >
                                    <img
                                        src={`./AvatarsImage/${img}`}
                                        alt={`Avatar ${index + 1}`}
                                        className={`w-40 h-64 cursor-pointer object-cover rounded-lg 
                                            ${image === images[index] ? 'scale-110 border-2 border-pink-600' : 'hover:scale-110 hover:border-2 hover:border-pink-600'}`}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold my-4">*Enter Details</h2>
                        <div className="flex gap-5">
                            <div className="flex w-full">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full p-4 rounded-xl bg-[#3a2477] text-zinc-400 font-medium placeholder:font-medium focus:outline-none 
                                    ${name === "" ? "placeholder:text-zinc-400 " : "placeholder:text-transparent"}`}
                                    placeholder="Enter Name"
                                    autoComplete="off" 
                                />

                            </div>
                            <div className="flex w-full">
                                <select
                                    id="preference"
                                    value={preference}
                                    onChange={(e) => setPreference(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-[#3a2477] font-medium placeholder:font-medium text-zinc-400 focus:outline-none"
                                >
                                    <option value="">Select a preference</option>
                                    <option value="traveling">Traveling</option>
                                    <option value="reading">Reading</option>
                                    <option value="fitness">Fitness</option>
                                    <option value="music">Music</option>
                                    <option value="cooking">Cooking</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="technology">Technology</option>
                                    <option value="art">Art</option>
                                    <option value="adventure">Adventure</option>
                                    <option value="gaming">Gaming</option>
                                </select>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Div: Form */}
                <div className="w-full md:w-1/2 p-6">
                    {/* Personality Selection */}
                    <h2 className="text-xl font-semibold my-4">*Personality</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        {displayedItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => setPersonality(item)}
                                className={`w-full text-gray-400 py-2 font-medium  border-2 rounded-lg hover:border-[#bf61d4] text-center ${personality === item ? "border-zinc-700 bg-gradient-to-b from-[#2F9FFC] to-[#C702F5] text-white" : "border-zinc-600"}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="flex w-full justify-end">
                        <button
                            onClick={handleToggle}
                            className="flex px-4 py-2 text-pink-700 font-semibold text-sm items-center hover:text-pink-900"
                        >
                            <span>{showAll ? "Less" : "More"}</span>
                            <span>
                                {showAll ? (
                                    <div className="flex">
                                        <span><IoChevronBack size={15} /></span><span><IoChevronBack size={15} /></span>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <span><IoChevronForward size={15} /></span> <span><IoChevronForward size={15} /></span>
                                    </div>
                                )}
                            </span>
                        </button>
                    </div>
                    {/* Age Selection */}
                    <div>
                        <h2 className="text-xl font-semibold my-4">*Age Preferences</h2>
                        <div className="flex w-full gap-5 items-center">
                            <div className="flex text-gray-400 w-1/6  p-2 border-2 border-zinc-600  rounded-lg justify-center items-center">
                                <span> {age}+</span>
                            </div>
                            <div className="flex w-5/6">
                                <Slider
                                    min={19}
                                    max={100}
                                    value={age}
                                    onChange={handleSliderChange}
                                    step={1}
                                    marks={{
                                        19: "19",
                                        30: "30",
                                        50: "50",
                                        70: "70",
                                        100: "100",
                                    }}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold my-4">*Define his/her</h2>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-4 rounded-xl bg-[#3a2477] font-medium placeholder:font-medium text-zinc-400 "
                            placeholder="Write a description..."
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="w-full text-center mt-4 md:mt-0 md:w-auto">
                <button
                    onClick={handleSubmit}
                    className="py-3 w-2/3 md:w-1/2 bg-gradient-to-r from-pink-500 via-violet-400 to-blue-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-blue-600 transition"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ModalPage;





