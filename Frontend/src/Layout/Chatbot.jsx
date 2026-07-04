import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar.jsx";
import "../Styles/chatbot.css";
import { io } from "socket.io-client";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  setChats,
  startNewChat,
  selectChat,
  setInput,
  setMessages,
  addMessage,
  deleteChat
} from "../store/chatSlice.js";

const BACKEND_URL = import.meta.env.VITE_API_BASE || "https://techsaarthi.onrender.com";

const Chatbot = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId, messages, input: inputText } = useSelector(
    (state) => state.chat
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, {
      withCredentials: true,
    });

    socketRef.current.on("ai-response", (data) => {
      if (data.chat === activeChatId) {
        dispatch(addMessage({ role: "model", content: data.content }));
      }
    });

    fetchChats();

    return () => {
      socketRef.current.disconnect();
    };
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/chat`, { withCredentials: true });
      let chatData = response.data?.data || response.data || [];
      
      if (!Array.isArray(chatData)) {
        chatData = [];
      }

      dispatch(setChats(chatData));
      if (chatData.length > 0 && !activeChatId) {
        dispatch(selectChat(chatData[0]._id));
        fetchMessages(chatData[0]._id);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      dispatch(setChats([]));
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/chat/messages/${chatId}`, {
        withCredentials: true,
      });
      let messageData = response.data?.data || response.data || [];
      
      if (!Array.isArray(messageData)) {
        messageData = [];
      }

      dispatch(setMessages(messageData));
    } catch (error) {
      console.error("Error fetching messages:", error);
      dispatch(setMessages([]));
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/chat`,
        { title: "New Chat" },
        { withCredentials: true }
      );
      const newChat = response.data?.data || response.data;
      dispatch(startNewChat(newChat));
      dispatch(setMessages([]));
      setSidebarOpen(false);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSelectChat = (chatId) => {
    dispatch(selectChat(chatId));
    fetchMessages(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); 
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/chat/${chatId}`, {
        withCredentials: true,
      });
      dispatch(deleteChat(chatId));
      if (activeChatId === chatId) {
        dispatch(setMessages([]));
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;

    const currentInput = inputText;
    const newMessage = { role: "user", content: currentInput };
    dispatch(addMessage(newMessage));

    if (messages.length === 0) {
      const newTitle = currentInput.length > 25 ? currentInput.substring(0, 25) + "..." : currentInput;
      try {
        await axios.put(
          `${BACKEND_URL}/api/v1/chat/${activeChatId}`,
          { title: newTitle },
          { withCredentials: true }
        );
        const updatedChats = chats.map((chat) =>
          chat._id === activeChatId ? { ...chat, title: newTitle } : chat
        );
        dispatch(setChats(updatedChats));
      } catch (error) {
        console.error("Error updating chat title:", error);
      }
    }

    socketRef.current.emit("ai-message", {
      chat: activeChatId,
      content: currentInput,
    });

    dispatch(setInput(""));
  };

  return (
    <>
      <div className="chatpage-main-layout">
        {sidebarOpen && (
          <div
            className="chatpage-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="chatpage-container">
          <div className="chatpage-mobile-topbar">
            <button
              className="chatpage-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <span className="chatpage-mobile-title">
              {chats.find((c) => c._id === activeChatId)?.title || "TechSaarthi"}
            </span>
            <button className="chatpage-mobile-newchat" onClick={handleNewChat}>
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>

          <div className="chatpage-chat-box">
            <div className="chatpage-messages">
              {!Array.isArray(messages) || messages.length === 0 ? (
                <div className="chatpage-message bot">
                  Hi, how can I help you today?
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chatpage-message ${
                      msg.role === "user" ? "user" : "bot"
                    }`}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatpage-input-bar">
              <input
                type="text"
                placeholder="Welcome To TechSaarthi..."
                value={inputText}
                onChange={(e) => dispatch(setInput(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <div className={`chatpage-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="chatpage-sidebar-header">
            <button className="chatpage-newchat-btn" onClick={handleNewChat}>
              <i className="fa-solid fa-plus"></i>
              New Chat
            </button>
            <button
              className="chatpage-sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="chatpage-chat-list">
            {Array.isArray(chats) &&
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                  className={`chatpage-chat-item ${
                    activeChatId === chat._id ? "active" : ""
                  }`}
                >
                  <span>{chat.title}</span>
                  <i 
                    className="fa-solid fa-trash chatpage-delete-icon" 
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                  ></i>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;