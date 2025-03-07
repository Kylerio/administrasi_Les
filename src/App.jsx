import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import Profile from "./pages/Profile"
import Fee from "./pages/Fee"
import ProfileForm from "./pages/ProfileForm"
import Login from "./pages/Login"
import { useEffect, useState } from "react"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }
  , []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/profileForm" element={isLoggedIn ? <ProfileForm /> : <Navigate to="/login" replace />}/>
        <Route path="/" element={isLoggedIn ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Home />}/>
          <Route path="schedule" element={<Schedule />}/>
          <Route path="profile" element={<Profile />}/>
          <Route path="fee" element={<Fee />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
