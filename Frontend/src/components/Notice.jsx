import React from "react";

import Navbar from "../Layout/Navbar.jsx";

import "../Styles/Notice.css";
import Notification from "../assets/Notificationimage.png"
const Notice = () => {
  return (
    <>
      

      <div className="notice-container">

        <div className="notice-box">


          <div className="notice-header">

            <img src={Notification} alt="" />

            <span>Important Alerts</span>

          </div>

          {/* ALERT LIST */}

          <div className="alerts-list">

            <div className="alert-item">

              <span>
                National Level Hackathon 2k26 Bansal Group of
                Institutes, Madhya Pradesh
                <a href="/"> Click Here to View</a>
              </span>

              <span className="alert-time">
                5hrs ago
              </span>

            </div>

            <div className="alert-item">

              <span>
                National Level Hackathon 2k26 Bansal Group of
                Institutes, Madhya Pradesh
                <a href="/"> Click Here to View</a>
              </span>

              <span className="alert-time">
                5hrs ago
              </span>

            </div>

            <div className="alert-item">

              <span>
                National Level Hackathon 2k26 Bansal Group of
                Institutes, Madhya Pradesh
                <a href="/"> Click Here to View</a>
              </span>

              <span className="alert-time">
                5hrs ago
              </span>

            </div>

            <div className="alert-item">

              <span>
                National Level Hackathon 2k26 Bansal Group of
                Institutes, Madhya Pradesh
                <a href="/"> Click Here to View</a>
              </span>

              <span className="alert-time">
                5hrs ago
              </span>

            </div>
            <div className="alert-item">

              <span>
                National Level Hackathon 2k26 Bansal Group of
                Institutes, Madhya Pradesh
                <a href="/"> Click Here to View</a>
              </span>

              <span className="alert-time">
                5hrs ago
              </span>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Notice;