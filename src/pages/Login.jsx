import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const dummyUser = [
  {email: "rimuru@example.com", password: "password123", role: "teacher"},
  {email: "okemin@example.com", password: "digidawaw", role: "admin"},
];

const Login = ({ setIsLoggedIn, setRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
      e.preventDefault();

      //ini kalo mau pake email dan password beneran
      if (email === "rimuru@example.com" && password === "password123") {
        localStorage.setItem("token", "true");
        localStorage.setItem("role", "teacher");
        setIsLoggedIn(true);
        setRole("teacher");
        navigate("/profileForm");
      } else if (email === "admin@example.com" && password === "adminpass") {
        localStorage.setItem("token", "true");
        localStorage.setItem("role", "admin");
        setIsLoggedIn(true);
        setRole("admin");
        navigate("/admin");
      } else {
        setError("Email atau password salah");
      }

      /* ini kalo mau pake dummy user
      const user = dummyUser.find((user) => user.email === email && user.password === password);

      if (user) {
        localStorage.setItem("token", "true");
        localStorage.setItem("role", user.role);

        if (user.role === "teacher") {
          navigate("/profileForm");
        } else if (user.role === "admin") {
          navigate("/admin");
        }
      } else {
        setError("Email or password is wrong");
      } */
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
  )
}

export default Login