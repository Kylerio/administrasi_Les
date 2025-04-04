import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Store profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the profile data from the backend
    const fetchProfile = async () => {
      try {
        const teacherId = localStorage.getItem("id");

        // Ensure `teacher_id` exists in LocalStorage
        if (!teacherId) {
          throw new Error("Teacher ID not found in LocalStorage. Please log in again.");
        }

        console.log("Fetching profile for Teacher ID:", teacherId);

        const response = await fetch(
          `http://localhost/administrasi_les_api/teachers.php?teacher_id=${teacherId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile. Please check the backend.");
        }

        const data = await response.json();

        // Ensure the profile data is valid
        if (data && data.length > 0) {
          setProfile(data[0]);
          console.log("Profile fetched successfully:", data[0]);
        } else {
          setError("No profile data found for this teacher.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
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
            <img
              src={
                profile.profile_picture
                  ? `http://localhost/administrasi_les_api/uploads/${profile.profile_picture}`
                  : "https://randomuser.me/api/portraits/lego/3.jpg"
              }
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 shadow-md mb-4"
            />

            {/* Profile Data */}
            <div className="text-gray-600 text-lg space-y-2 w-full">
              <p><strong>Name:</strong> {profile.name || "No name provided"}</p>
              <p><strong>Subject:</strong> {profile.subject || "No subject assigned"}</p>
              <p><strong>Location:</strong> {profile.location || "No location specified"}</p>
              <p><strong>Available Days:</strong> {profile.availability || "No availability provided"}</p>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => navigate("/teacher/profile/edit")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
