import React from "react";
import Navbar from "./Navbar.jsx";
import "../Styles/chatbot.css";

const Chatbot = () => {
  return (
    <>

      

      <div className="chatpage-main-layout">

        {/* ================= CHAT CONTAINER ================= */}

        <div className="chatpage-container">

          <div className="chatpage-chat-box">

            {/* ================= MESSAGES ================= */}

            <div className="chatpage-messages">

              {/* DUMMY MESSAGE */}

              <div className="chatpage-message user">
                Hello 👋
              </div>

              <div className="chatpage-message bot">
                Hi, how can I help you today?
              </div>

            </div>

            {/* ================= INPUT BAR ================= */}

            <div className="chatpage-input-bar">

              <input
                type="text"
                placeholder="Click here to type..."
              />

              <button>

                <i className="fa-solid fa-paper-plane"></i>

              </button>

            </div>

          </div>

        </div>

        {/* ================= SIDEBAR ================= */}

        <div className="chatpage-sidebar">

          <button className="chatpage-newchat-btn">

            <i className="fa-solid fa-plus"></i>

            New Chat

          </button>

        </div>

      </div>

    </>
  );
};

export default Chatbot;