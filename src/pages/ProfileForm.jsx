import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ setIsProfileComplete }) => {
    const [name, setName] = useState(""); // Teacher's name
    const [email, setEmail] = useState(""); // Teacher's email
    const [subject, setSubject] = useState(""); // Subject expertise
    const [location, setLocation] = useState(""); // Location
    const [availableDays, setAvailableDays] = useState(""); // Availability days
    const [profilePicture, setProfilePicture] = useState(""); // Profile picture (file name for now)
    const [errorMessage, setErrorMessage] = useState(""); // To display errors
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const userId = localStorage.getItem("id");
                const userEmail = localStorage.getItem("email");

                if (!userId || !userEmail) {
                    setErrorMessage("No user ID or email found in localStorage.");
                    return;
                }

                const response = await fetch('http://localhost/administrasi_les_api/teachers.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId, email: userEmail }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    setErrorMessage("Failed to fetch profile data. Please try again.");
                    return;
                }

                const data = await response.json();
                setName(data.name || "");
                setEmail(data.email || "");
                setSubject(data.subject || "");
                setLocation(data.location || "");
                setAvailableDays(data.availability || "");
                setProfilePicture(data.profile_picture || "");
            } catch (error) {
                setErrorMessage("An unexpected error occurred while fetching data.");
            }
        };

        fetchTeacherData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !subject || !location || !availableDays) {
            setErrorMessage("All fields are required. Please fill out the form completely.");
            return;
        }

        const payload = {
            name,
            email,
            subject,
            location,
            availableDays: availableDays.split(",").map((day) => day.trim()),
            profilePicture, // Send profile picture name for now
        };

        try {
            const response = await fetch('http://localhost/administrasi_les_api/teachers.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), // Send JSON payload
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrorMessage("Failed to save profile. Please try again.");
                return;
            }

            const result = await response.json();
            if (result.message === "Profile created successfully" || result.message === "Profile updated successfully") {
                setIsProfileComplete(true);
                navigate("/home"); // Redirect after successful submission
            } else {
                setErrorMessage(result.message || "Failed to save profile.");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred while saving the profile.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Please fill out your profile</h2>

                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                        {errorMessage}
                    </div>
                )}

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
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
