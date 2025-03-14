import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ setIsProfileComplete }) => {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [location, setLocation] = useState("");
    const [availableDays, setAvailableDays] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file){
            setProfilePicture(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const profileData = {
            name,
            subject,
            location,
            availableDays,
            profilePicture
        }

        localStorage.setItem("userProfile", JSON.stringify(profileData));
        setIsProfileComplete(true);
        navigate("/home");
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Please fill out your profile below</h2>

                {/* Upload Gambar */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-4">Profile Picture</label>
                    <div className='w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 mb-4'>
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-xs md:text-sm">No Image</span>
                        )}
                    </div>

                    <label className='cursor-pointer bg-blue-600 text-white mb-4 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base'>
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full p-2 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="text" placeholder="Subject" className="w-full p-2 border rounded-lg" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                    <input type="text" placeholder="Location" className="w-full p-2 border rounded-lg" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    <input type="text" placeholder="Available Days" className="w-full p-2 border rounded-lg" value={availableDays} onChange={(e) => setAvailableDays(e.target.value.split(','))} required />
                    <p className="text-xs text-gray-500">Separate each day with a comma. Example: Monday, Tuesday, Wednesday</p>

                    <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition">Save Profile</button>
                </form>
            </div>
        </div>
    )
}

export default ProfileForm