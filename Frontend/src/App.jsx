import { useState } from "react";
// ✨ FIX 1: Import useLocation
import { Route, Routes, useLocation } from "react-router-dom"; 
import Navbar from "./Layout/Navbar.jsx";
import Userlogin from "./Pages/Auth/Userlogin.jsx";
import Usersignup from "./Pages/Auth/UserSignup.jsx";
import Main from "./components/Main.jsx";
import "./App.css";
import About from "./components/About.jsx";
import Notice from "./components/Notice.jsx";
import CollegeInfo from "./Pages/User/UserForm.jsx";
import CollegeForm from "./Pages/College/CollegeForm.jsx";
import Chatbot from "./Layout/Chatbot.jsx";
import GovernmentForm from "./Pages/Government/GovernmentForm.jsx";

function App() {
  const [role, setRole] = useState(
    localStorage.getItem("userRole") || null
  );

  // ✨ FIX 2: Get the current route location
  const location = useLocation(); 

  // ✨ FOOLPROOF FIX: Sab paths ko lowercase mein daalein
  const hideNavbarPaths = ["/userlogin", "/usersignup","/"];
  
  // Current URL ko bhi lowercase karke check karein
  const currentPath = location.pathname.toLowerCase();
  const showNavbar = !hideNavbarPaths.includes(currentPath);
  return (
    <>
      {/* ✨ FIX 4: Only render Navbar if showNavbar is true */}
      {showNavbar && <Navbar role={role} setRole={setRole} />}

      <Routes>
        <Route path="/" element={<Main />} />
        
        <Route path="/UserLogin" element={<Userlogin setRole={setRole} />} />
        <Route path="/UserSignup" element={<Usersignup />} />

        {/* Shared Routes */}
        <Route path="/About" element={<About />} />
        <Route path="/Notice" element={<Notice />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/Helpline" element={<div>Helpline Page Placeholder</div>} />

        {/* Role Specific Routes */}
        {role === "user" && <Route path="/CollegeInfo" element={<CollegeInfo />} />}
        {role === "college" && <Route path="/CollegeForm" element={<CollegeForm />} />}
        {role === "government" && <Route path="/GovernmentForm" element={<GovernmentForm />} />}
      </Routes>
    </>
  );
}

export default App;