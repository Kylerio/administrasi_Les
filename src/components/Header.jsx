import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// icons
import { GoBell } from "react-icons/go";
import { FiLogOut, FiMenu } from "react-icons/fi";

import API_URL from "../api"; // Import the base API URL

const Header = () => {
    const [showDropDown, setShowDropDown] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profile, setProfile] = useState(null); // Profile data
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    useEffect(() => {
        // Retrieve the teacher ID and email from localStorage
        const teacherId = localStorage.getItem("id");
        const email = localStorage.getItem("email");

        if (teacherId && email) {
            // Fetch the teacher's profile from the database using the getProfile.php API
            const fetchProfile = async () => {
                try {
                    const response = await fetch(`${API_URL}/getProfile.php`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ teacher_id: teacherId, email }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch profile data. Please check the backend.");
                    }

                    const data = await response.json();

                    if (data.profile) {
                        setProfile({
                            name: data.profile.name,
                            profilePicture: data.profile.profile_picture
                                ? `${API_URL}/${data.profile.profile_picture}` // Construct full path for profile picture
                                : "https://randomuser.me/api/portraits/lego/3.jpg", // Default profile picture
                        });
                    } else {
                        throw new Error(data.message || "No profile data found.");
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error.message);
                }
            };

            fetchProfile();
        }
    }, []); // Runs once when the component mounts

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
            {/* Current Date & Time */}
            <div className='text-md text-gray-600'>
                {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
            </div>

            {/* Profile Menu */}
            <div className='flex items-center space-x-5'>
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