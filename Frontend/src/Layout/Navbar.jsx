import React from "react";
import "../Styles/Navbar.css";
import TechSaarthi from "../assets/TechSaarthi.png";

const Navbar = () => {
  return (
    <nav className="navbar">

      <ul className="menu left">
        <li>
          <a href="/about">About Us</a>
        </li>

        <li>
          <a href="/helpline">Helpline</a>
        </li>

        <li>
          <a href="/chatbot">Chatbot</a>
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

        <li>
          <a href="/notice">Notice</a>
        </li>

        <li>
          <a href="/details">Details</a>
        </li>

        <li>
          <a href="/login">Login</a>
        </li>

      </ul>

    </nav>
  );
};

export default Navbar;