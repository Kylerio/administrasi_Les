import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// icons
import { GoBell } from "react-icons/go";
import { FiLogOut, FiMenu } from "react-icons/fi";

const Header = () => {
    const [showDropDown, setShowDropDown] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profile, setProfile] = useState(null);

    useEffect(() => {
            const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
            if (savedProfile) setProfile(savedProfile);
        }, []);

    useEffect(() =>{
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='flex justify-between items-center p-4'>
            {/* Waktu & Tanggal */}
            <div className='text-md text-gray-600'>
                {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
            </div>

            {/* Menu */}
            <div className='flex items-center space-x-5'>
                {/* Search */}
                <div className='hidden md:flex'>
                    <input 
                        type="text" 
                        placeholder='Search...'
                        className='bg-indigo-100/30 px-4 py-2 rounded-lg focus:outline-0 focus:ring-2 focus:ring-indigo-600' 
                    />
                </div>

                {/* Notif */}
                <div className='flex items-center space-x-5'>
                    <button className='relative text-2xl text-gray-600'>
                        <GoBell size={32} />
                        <span className='absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-indigo-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white'>2</span>
                    </button>
                </div>

                {/* Profile */}
                <div>
                    <img 
                        onClick={() => setShowDropDown(!showDropDown)}
                        className='w-10 h-10 rounded-full border-2 cursor-pointer'
                        src={profile?.profilePicture || "https://randomuser.me/api/portraits/lego/3.jpg"} 
                        alt="profile" 
                    />

                    {showDropDown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md p-2">
                            <Link to="/teacher/profile" className='block px-4 py-2 hover:bg-gray-100'>
                                Profile
                            </Link>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                <FiLogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            
            </div>
        
        
        </div>
    )
}

export default Header