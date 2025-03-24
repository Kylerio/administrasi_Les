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
            console.log(response.data); // Log the response for debugging

            if (response.data.message === "Login successful") {
                // Set user data in local storage
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("isProfileComplete", response.data.isProfileComplete);

                // Update state
                setIsLoggedIn(true);
                setRole(response.data.role);
                console.log("Set State:", response.data.role);
                console.log("Login is successful!");
                console.log("Role:", response.data.role);
                console.log("Profile complete:", response.data.isProfileComplete);
                
                // Redirect based on role
                if (response.data.role === 'teacher') {
                    console.log("Navigating to /profileForm");
                    navigate("/profileForm"); // Change to your teacher dashboard route
                } else if (response.data.role === 'admin') {
                    console.log("Navigating to /admin");
                    navigate('/admin'); // Change to your admin dashboard route
                }
            } else {
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
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
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
