import { useState } from "react";
import { Route, Routes } from "react-router-dom";
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

  return (
    <>
      <Routes>
        <Route
          path="/Navbar"
          element={<Navbar role={role} setRole={setRole} />}
        />

        <Route path="/" element={<Main />} />

        <Route
          path="/UserLogin"
          element={<Userlogin setRole={setRole} />}
        />

        <Route
          path="/UserSignup"
          element={<Usersignup />}
        />

        {/* Shared Routes */}
        <Route path="/About" element={<About />} />
        <Route path="/Notice" element={<Notice />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route
          path="/Helpline"
          element={<div>Helpline Page Placeholder</div>}
        />

        {/* Role Specific Routes */}
        {role === "user" && (
          <Route
            path="/CollegeInfo"
            element={<CollegeInfo />}
          />
        )}

        {role === "college" && (
          <Route
            path="/CollegeForm"
            element={<CollegeForm />}
          />
        )}

        {role === "government" && (
          <Route
            path="/GovernmentForm"
            element={<GovernmentForm />}
          />
        )}
      </Routes>
    </>
  );
}

export default App;