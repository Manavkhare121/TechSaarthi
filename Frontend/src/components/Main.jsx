import React from "react";
import Navbar from "../Layout/Navbar.jsx";

import "../Styles/Main.css";

import MainImage from "../assets/MainImage.png";

const Main = () => {
  return (
    <>
      <Navbar />
      <div className="main-page">

        <div className="main-img2-container">

          {/* IMAGE TAG */}

          <img
            src={MainImage}
            alt="College Banner"
            className="main-img2"
          />

          {/* CONTENT OVER IMAGE */}

          <div className="main-box2">

            <h1 className="main-heading1">

              Get Into Your

              <span> Dream College!</span>

            </h1>

            <div className="main-para-box">

              <p>
                Education is one thing no one can take away from you
              </p>

            </div>

            <div className="main-btn-box">

              <button className="main-btn">
                Get Started
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Main;