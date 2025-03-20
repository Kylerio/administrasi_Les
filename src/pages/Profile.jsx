import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (savedProfile) setProfile(savedProfile);
    }, []);

    return (
        <div className='flex justify-center items-center bg-gray-100 px-4 min-h-screen'>
            <div className='p-6 bg-white rounded-lg shadow-lg max-w-md md:max-w-xl w-full'>
                <h2 className='text-2xl font-semibold mb-4'>Teacher Profile</h2>

                {profile ? (
                    <div className='flex flex-col items-center'>
                        {/* Profile Picture */}
                        {profile.profilePicture && <img src={profile.profilePicture || "https://randomuser.me/api/portraits/lego/3.jpg"} alt='Profile' className='w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 shadow-md mb-4' />}

                        {/* Profile Data */}
                        <div className='text-gray-600 text-lg space-y-2 w-full'>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Subject:</strong> {profile.subject}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Available Days:</strong> {profile.availableDays.join(', ')}</p>
                        </div>

                        {/* Tombol Edit */}
                        <button onClick={() => navigate('/profileForm')} className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Edit Profil</button>
                    </div>
                ) : (
                    <p className='text-gray-500'>There is no Data Profile.</p>
                )}
            </div>

        </div>
        
    )
}

export default Profile