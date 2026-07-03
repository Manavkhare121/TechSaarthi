import React, { useState } from "react";
import "../Styles/Navbar.css";
import TechSaarthi from "../assets/TechSaarthi.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ role, setRole }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE || "https://techsaarthi.onrender.com";

  const getLeftMenuLinks = () => {
    if (role === "government") {
      return [
        { label: "Helpline", path: "/Helpline" },
        { label: "Notice Upload", path: "/adminnotice" },
      ];
    } else if (role === "college") {
      return [
        { label: "Helpline", path: "/Helpline" },
        { label: "Chatbot", path: "/chatbot" },
      ];
    } else {
      return [
        { label: "Helpline", path: "/Helpline" },
        { label: "Chatbot", path: "/chatbot" },
      ];
    }
  };

  const leftLinks = getLeftMenuLinks();

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleDetailsClick = () => {
    let path = "/About";
    if (role === "user") path = "/CollegeInfo";
    else if (role === "college") path = "/CollegeForm";
    else if (role === "government") path = "/GovernmentForm";
    handleNav(path);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log("Backend Response:", response.data.message);
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error.message);
    } finally {
      localStorage.removeItem("userRole");
      if (setRole) setRole(null);
      setMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      {/* Desktop links */}
      <ul className="menu left">
        <li onClick={() => navigate("/About")}>About Us</li>
        {leftLinks.map((link, index) => (
          <li key={index} onClick={() => navigate(link.path)}>
            {link.label}
          </li>
        ))}
      </ul>

      <div className="box1">
        <img src={TechSaarthi} alt="TechSaarthi Logo" className="logo" />
      </div>

      <ul className="menu right">
        <li onClick={() => navigate("/Notice")}>Notice</li>
        <li onClick={handleDetailsClick}>Details</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>

      {/* Mobile hamburger button - top right corner */}
      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <ul className="mobile-menu">
          <li onClick={() => handleNav("/About")}>About Us</li>
          {leftLinks.map((link, index) => (
            <li key={index} onClick={() => handleNav(link.path)}>
              {link.label}
            </li>
          ))}
          <li onClick={() => handleNav("/Notice")}>Notice</li>
          <li onClick={handleDetailsClick}>Details</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;