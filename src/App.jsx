import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import Profile from "./pages/Profile"
import Fee from "./pages/Fee"
import ProfileForm from "./pages/ProfileForm"
import Login from "./pages/Login"
import CreateSession from "./adminpages/CreateSession"
import ViewDataTeacher from "./adminpages/ViewDataTeacher"
import AdminLayout from "./components/AdminLayout"
import ViewListFee from "./adminpages/ViewListFee"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [isProfileComplete, setIsProfileComplete] = useState(localStorage.getItem("isProfileComplete") === "true");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const profileStatus = localStorage.getItem("isProfileComplete");

    setIsLoggedIn(!!token);
    setRole(savedRole);
    setIsProfileComplete(profileStatus === "true");
  }, [isLoggedIn, role]);

  return (
    <BrowserRouter>
      <Routes>
        {/* halaman login */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}/>

        {/* jika teacher login pertama kali, harus isi form profile */}
        <Route path="/profileForm" element={
          isLoggedIn && role === "teacher" ? 
          (!isProfileComplete ? <ProfileForm setIsProfileComplete={setIsProfileComplete} /> : <Navigate to="/teacher" />)
          : <Navigate to="/login" />
        } />
        
        {/* side teacher */}
        <Route path="/teacher" element={isLoggedIn && role === "teacher" ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={isProfileComplete ? <Home /> : <Navigate to="/teacher" />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<ProfileForm />} />
          <Route path="fee" element={<Fee />} />
        </Route>

        {/* side admin */}
        <Route path="/admin" element={isLoggedIn && role === "admin" ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route index element={<CreateSession />} />
          <Route path="viewDataTeacher" element={<ViewDataTeacher />} />
          <Route path="viewListFee" element={<ViewListFee />} />
        </Route>

        {/* jika belum login, arahkan ke halaman login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
