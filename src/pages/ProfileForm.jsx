import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    subject: "",
    location: "",
    availability: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [refresh, setRefresh] = useState(false); // Trigger re-render
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const teacherId = localStorage.getItem("id");

        if (!teacherId) {
          setErrorMessage("Teacher ID not found. Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_URL}/teachers.php?teacher_id=${teacherId}`
        );

        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setProfile({
            name: data.name || "",
            email: data.email || "",
            subject: data.subject || "",
            location: data.location || "",
            availability: data.availability || "",
          });
          if (data.profile_picture) {
            setProfilePicture(data.profile_picture);
          }
        } else {
          setErrorMessage("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        setErrorMessage("An unexpected error occurred while fetching data.");
      }
    };

    fetchProfile();
  }, [navigate, refresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !profile.name ||
      !profile.email ||
      !profile.subject ||
      !profile.location ||
      !profile.availability
    ) {
      setErrorMessage("All fields are required. Please fill out the form completely.");
      return;
    }

    try {
      const teacherId = localStorage.getItem("id");

      if (!teacherId) {
        setErrorMessage("Teacher ID not found. Please log in again.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("teacher_id", teacherId);
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("subject", profile.subject);
      formData.append("location", profile.location);
      formData.append("availability", profile.availability);
      if (profilePicture instanceof File) {
        formData.append("profile_picture", profilePicture);
      }

      const response = await axios.post(`${API_URL}/updateProfile.php`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setProfilePicture(response.data.profile_picture); // Update profile picture
        setSuccessMessage("Profile updated successfully!");
        setRefresh(!refresh); // Trigger re-render
        setTimeout(() => {
          navigate("/teacher/profile");
        }, 2000);
      } else {
        setErrorMessage(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setErrorMessage("An unexpected error occurred while saving the profile.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Edit Profile</h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium mb-4">Profile Picture</label>
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 mb-4">
            {profilePicture ? (
              typeof profilePicture === "string" ? (
                <img
                  src={`${API_URL}/uploads/${profilePicture}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <span className="text-gray-400 text-xs md:text-sm">No Image</span>
            )}
          </div>
          <label className="cursor-pointer bg-blue-600 text-white mb-4 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded-lg"
            value={profile.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={profile.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full p-2 border rounded-lg"
            value={profile.subject}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full p-2 border rounded-lg"
            value={profile.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="availability"
            placeholder="Available Days"
            className="w-full p-2 border rounded-lg"
            value={profile.availability}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-500">
            Separate days with commas (e.g., Monday, Tuesday)
          </p>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;