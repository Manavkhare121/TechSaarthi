import React from "react";
import "../../Styles/Userlogin.css";
import LoginCartoon from "../../assets/LoginCartoon.png";
import GoogleLogo from "../../assets/GoogleLogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Userlogin = ({ setRole }) => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      const userRole = response.data.data.user.role;
      localStorage.setItem("userRole", userRole);
      if (setRole) {
        setRole(userRole);
      }

      navigate("/About");

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="userlogin-page">
      <div className="userlogin-container">
        <div className="userlogin-box1">
          <img
            src={LoginCartoon}
            alt="Login Cartoon"
            className="userlogin-img3"
          />
        </div>

        <div className="userlogin-box2">
          <div className="userlogin-login">
            <h3>LOGIN</h3>
            <p>Login to access your TravelWise account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="userlogin-input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="userlogin-input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="userlogin-option">
              <label className="userlogin-remember">
                <input type="checkbox" />
                Remember Me
              </label>

              <a href="#" className="userlogin-forgot">
                Forgot Password?
              </a>
            </div>

            <div className="userlogin-login-btn">
              <div className="userlogin-btn-box">
                <button type="submit" className="userlogin-btn">
                  LOGIN
                </button>
              </div>

              <div className="userlogin-sign-up">
                <p>
                  Don't have an account?
                  <span onClick={() => navigate("/UserSignup")}>
                    {" "}Sign Up
                  </span>
                </p>
              </div>

              <div className="userlogin-login-with">
                <p>
                  <span>Or login with</span>
                </p>
              </div>

              <div className="userlogin-google-btn">
                <button type="button" className="userlogin-btn2">
                  <img
                    src={GoogleLogo}
                    alt="Google Logo"
                    className="userlogin-img4"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Userlogin;