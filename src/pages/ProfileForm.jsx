import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ setIsProfileComplete }) => {
    const [name, setName] = useState(""); // Teacher's name
    const [subject, setSubject] = useState(""); // Subject expertise
    const [location, setLocation] = useState(""); // Location
    const [availableDays, setAvailableDays] = useState(""); // Availability days
    const [profilePicture, setProfilePicture] = useState(null); // Profile picture file
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch teacher's profile data based on logged-in user
        const fetchTeacherData = async () => {
            try {
                // Retrieve stored ID and email from localStorage
                const userId = localStorage.getItem("id");
                const userEmail = localStorage.getItem("email");

                if (!userId && !userEmail) {
                    console.error("No user ID or email found in localStorage");
                    return;
                }

                // Send POST request to fetch profile data
                const response = await fetch('http://localhost/administrasi_les_api/teachers.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId, email: userEmail }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data) {
                    setName(data.name || "");
                    setSubject(data.subject || "");
                    setLocation(data.location || "");
                    setAvailableDays(data.availability?.split(", ") || "");
                }
            } catch (error) {
                console.error("Error fetching teacher data:", error);
            }
        };

        fetchTeacherData();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the payload for updating the profile
        const payload = {
            name,
            subject,
            location,
            availableDays: availableDays.split(",").map((day) => day.trim()),
            profilePicture: profilePicture ? profilePicture.name : null, // Send only the file name
        };

        try {
            const response = await fetch('http://localhost/administrasi_les_api/teachers.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.message === "Profile created successfully" || result.message === "Profile updated successfully") {
                setIsProfileComplete(true);
                navigate("/home"); // Redirect to the home/dashboard page after successful submission
            } else {
                console.error("Error submitting form:", result.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Please fill out your profile</h2>

                {/* Profile Picture Upload */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-4">Profile Picture</label>
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 mb-4">
                        {profilePicture ? (
                            <img src={URL.createObjectURL(profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-xs md:text-sm">No Image</span>
                        )}
                    </div>
                    <label className="cursor-pointer bg-blue-600 text-white mb-4 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-2 border rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        className="w-full p-2 border rounded-lg"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full p-2 border rounded-lg"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Available Days"
                        className="w-full p-2 border rounded-lg"
                        value={availableDays}
                        onChange={(e) => setAvailableDays(e.target.value)}
                        required
                    />
                    <p className="text-xs text-gray-500">Separate days with commas (e.g., Monday, Tuesday)</p>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
