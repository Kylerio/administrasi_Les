import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import Profile from "./pages/Profile"
import Fee from "./pages/Fee"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
