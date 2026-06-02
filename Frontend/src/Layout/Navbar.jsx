import React from "react";
import "../Styles/Navbar.css";
import TechSaarthi from "../assets/TechSaarthi.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ role, setRole }) => {
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE || "http://localhost:3000";

  console.log("Navbar Role:", role);

  const handleDetailsClick = () => {
    console.log("Details Click Role:", role);

    if (role === "user") {
      navigate("/CollegeInfo");
    } else if (role === "college") {
      navigate("/CollegeForm");
    } else if (role === "government") {
      navigate("/GovernmentForm");
    } else {
      navigate("/UserLogin");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log(
        "Backend Response:",
        response.data.message
      );
    } catch (error) {
      console.error(
        "Logout Error:",
        error.response?.data || error.message
      );
    } finally {
      localStorage.removeItem("userRole");

      if (setRole) {
        setRole(null);
      }

      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <ul className="menu left">
        <li onClick={() => navigate("/About")}>
          About Us
        </li>

        <li onClick={() => navigate("/Helpline")}>
          Helpline
        </li>

        <li onClick={() => navigate("/chatbot")}>
          Chatbot
        </li>
      </ul>

      <div className="box1">
        <img
          src={TechSaarthi}
          alt="TechSaarthi Logo"
          className="logo"
        />
      </div>

      <ul className="menu right">
        <li onClick={() => navigate("/Notice")}>
          Notice
        </li>

        <li onClick={handleDetailsClick}>
          Details
        </li>

        <li onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;