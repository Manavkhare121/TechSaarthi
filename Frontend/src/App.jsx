import { useState } from "react";
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
import AdminNotice from "./Pages/Government/NoticeUpload.jsx";
import Helpline from "./Layout/Helpline.jsx";
import AdmissionAgent from "./Layout/Admissionagent.jsx";
function App() {
  const [role, setRole] = useState(
    localStorage.getItem("userRole") || null
  );

  const location = useLocation(); 

  const hideNavbarPaths = ["/userlogin", "/usersignup","/"];
  
  const currentPath = location.pathname.toLowerCase();
  const showNavbar = !hideNavbarPaths.includes(currentPath);
  return (
    <>
      
      {showNavbar && <Navbar role={role} setRole={setRole} />}

      <Routes>
        <Route path="/" element={<Main />} />
        
        <Route path="/UserLogin" element={<Userlogin setRole={setRole} />} />
        <Route path="/UserSignup" element={<Usersignup />} />

        <Route path="/About" element={<About />} />
        <Route path="/Notice" element={<Notice />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/adminnotice" element={<AdminNotice/>} />
        <Route path="/Helpline" element={<Helpline/>}/>
        
        {role === "user" && <Route path="/collegeinfo" element={<CollegeInfo />} />}
        {role === "college" && <Route path="/collegeform" element={<CollegeForm />} />}
        {role === "government" && <Route path="/governmentform" element={<GovernmentForm />} />}
      </Routes>
      {role === "user" && <AdmissionAgent />}
    </>
  );
}

export default App;