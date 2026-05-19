import React from "react";
import "../Styles/Navbar.css";
import TechSaarthi from "../assets/TechSaarthi.png";

import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <nav className="navbar">

      {/* LEFT MENU */}

      <ul className="menu left">

        <li onClick={() => navigate("/About")}>
          About Us
        </li>

        <li onClick={() => navigate("/CollegeForm")}>
          Helpline
        </li>

        <li onClick={() => navigate("/chatbot")}>
          Chatbot
        </li>

      </ul>

      {/* LOGO */}

      <div className="box1">

        <img
          src={TechSaarthi}
          alt="TechSaarthi Logo"
          className="logo"
        />

      </div>

      {/* RIGHT MENU */}

      <ul className="menu right">

        <li onClick={() => navigate("/Notice")}>
          Notice
        </li>

        <li onClick={() => navigate("/CollegeInfo")}>
          Details
        </li>

        <li onClick={() => navigate("/UserLogin")}>
          Login
        </li>

      </ul>

    </nav>
  );
};

export default Navbar;