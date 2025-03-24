import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the profile data from the backend
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost/administrasi_les_api/teachers.php', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await response.json();
                setProfile(data[0]); // Assuming the first profile in the response is used
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="flex justify-center items-center bg-gray-100 px-4 min-h-screen">
            <div className="p-6 bg-white rounded-lg shadow-lg max-w-md md:max-w-xl w-full">
                <h2 className="text-2xl font-semibold mb-4">Teacher Profile</h2>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : profile ? (
                    <div className="flex flex-col items-center">
                        {/* Profile Picture */}
                        {profile.profilePicture && (
                            <img
                                src={profile.profilePicture || 'https://randomuser.me/api/portraits/lego/3.jpg'}
                                alt="Profile"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 shadow-md mb-4"
                            />
                        )}

                        {/* Profile Data */}
                        <div className="text-gray-600 text-lg space-y-2 w-full">
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Subject:</strong> {profile.subject}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Available Days:</strong> {profile.availability}</p>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => navigate('/profileForm')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500">No profile data found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
