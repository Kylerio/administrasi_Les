import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api'; // Ensure this points to the correct API URL

const Login = ({ setIsLoggedIn, setRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login button clicked");
        setError("");

        // Basic validation
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/login.php`, {
                email,
                password,
            });
            console.log("Login Response:", response.data);

            if (response.data.message === "Login successful") {
                // Store relevant user data in localStorage
                localStorage.setItem("id", response.data.teacher_id); // Store the ID
                localStorage.setItem("email", response.data.email);   // Store the email
                localStorage.setItem("token", response.data.token);   // Store the authentication token
                localStorage.setItem("role", response.data.role);     // Store the user role
                localStorage.setItem("isProfileComplete", response.data.isProfileComplete); // Store the profile completion status

                // Update React state
                setIsLoggedIn(true);
                setRole(response.data.role);

                console.log("Login is successful!");
                console.log("ID:", response.data.teacher_id);
                console.log("Email:", response.data.email);
                console.log("Role:", response.data.role);
                console.log("Profile complete:", response.data.isProfileComplete);

                // Redirect based on role
                if (response.data.role === 'teacher') {
                    console.log("Navigating to /profileForm");
                    navigate("/profileForm"); // Redirect teacher to profile form
                } else if (response.data.role === 'admin') {
                    console.log("Navigating to /admin");
                    navigate('/admin'); // Redirect admin to admin dashboard
                }
            } else {
                // Display error message from the server
                setError(response.data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-semibold text-center mb-4">Login</h2>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
