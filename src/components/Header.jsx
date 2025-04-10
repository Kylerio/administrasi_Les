import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// icons
import { GoBell } from "react-icons/go";
import { FiLogOut, FiMenu } from "react-icons/fi";

const Header = () => {
    const [showDropDown, setShowDropDown] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (savedProfile) setProfile(savedProfile);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage data
        navigate("/login"); // Redirect to the login page
    };

    return (
        <div className='flex justify-between items-center p-4'>
            {/* Waktu & Tanggal */}
            <div className='text-md text-gray-600'>
                {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
            </div>

            {/* Menu */}
            <div className='flex items-center space-x-5'>
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
                            <button
                                onClick={handleLogout} // Attach the logout function
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                            >
                                <FiLogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;