import React from 'react';
import { GiCheckMark } from "react-icons/gi";
function Pricing() {
    return (
        <div className="flex flex-col items-center justify-center p-4 rounded-lg shadow-md shadow-violet-950" style={{ background: 'linear-gradient(180deg, #3e1e46, #1a1b3e)' }}>
            {/* Card Container */}
            <div className=" p-6 text-center">
                {/* Title */}
                <h2 className="text-4xl font-bold text-white">Upgrade to <span className="bg-gradient-to-b from-pink-500 to-blue-500 bg-clip-text text-transparent">
                    Premium
                </span>
                </h2>

                {/* Features */}
                <h3 className='my-4'>
                    Unlock Your Feature
                </h3>
                <p className="text-white font-bold ">
                    Enjoy your <span className="font-medium  text-violet-600">Free Plan</span> with
                </p>
                <div className='flex font-bold text-md justify-center gap-2'>
               
                    <span>10 messages daily,</span>
                    <span>2 AI Avatars,</span>
                    <span>100 AI Creations per day</span>
             
                </div>
                



                {/* Call to Action */}
                <div className='flex flex-col md:flex-row w-full gap-5 my-4 '>
                    <div className='border-2 border-pink-600 px-4 py-8 rounded-xl bg-indigo-950  ' >
                        <div className='flex min-w-80   justify-between'>
                            <div className=" text-3xl font-extrabold bg-gradient-to-b from-pink-500 to-blue-500 bg-clip-text text-transparent">Classical plan</div>
                            <div className="flex text-sm font-semibold items-center p-2 rounded-xl bg-gradient-to-b from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">10% Off</div>
                        </div>
                        <div className='flex w-full gap-5 py-4'>
                            <img src="./image/Group.png" alt="logo" className='w-20' />
                            <div className='space-y-4'>
                                <div className='flex gap-2 font-bold'>
                                    <span><GiCheckMark /></span>  <span>1000 Message/week</span>
                                </div>
                                <div className='flex gap-2 font-bold'>
                                    <span><GiCheckMark /></span>  <span> 10 Avatars/week</span>

                                </div>
                            </div>
                        </div>
                        <div className='flex text-4xl font-bold justify-start'>
                            ₹ 999.00/month
                        </div>
                        <div className="flex justify-start text-lg ">
                            <span className="line-through text-violet-400">₹ 1299.00/month</span>
                        </div>


                        <div className='flex w-full mt-4 justify-center items-center'>
                            <button className="flex items-center font-bold px-12 py-2 rounded-xl bg-gradient-to-b from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">
                                Subscribe
                            </button>
                        </div>
                    </div>
                    <div className='border-2 border-pink-600 px-4 py-8 rounded-xl bg-indigo-950'>
                        <div className='flex min-w-80 justify-between'>
                            <div className="text-3xl font-extrabold bg-gradient-to-b from-pink-500 to-blue-500 bg-clip-text text-transparent">Unlimited plan</div>
                            <div className="flex text-sm font-semibold items-center p-2 rounded-xl bg-gradient-to-b from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">10% Off</div>
                        </div>
                        <div className='flex w-full gap-5 py-4'>
                            <img src="./image/Group.png" alt="logo" className='w-20' />
                            <div className='space-y-4'>
                                <div className='flex gap-2 font-bold'>
                                    <span><GiCheckMark /></span><span>Unlimited Messages/week</span>

                                </div>
                                <div className='flex gap-2 font-bold'>
                                    <span><GiCheckMark /></span><span>No limit on Avatars/week</span>

                                </div>
                            </div>
                        </div>
                        <div className='flex text-4xl font-bold justify-start'>
                            ₹ 3499.00/month
                        </div>
                        <div className="flex justify-start text-lg ">
                            <span className="line-through text-violet-400">₹ 3999.00/month</span>
                        </div>
                        <div className='flex w-full mt-4 justify-center items-center'>
                            <button className="flex items-center font-bold px-12 py-2 rounded-xl bg-gradient-to-b from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Pricing;
