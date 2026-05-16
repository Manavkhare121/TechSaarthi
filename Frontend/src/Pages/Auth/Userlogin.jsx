import React from "react";
import "../../Styles/Userlogin.css";

import LoginCartoon from "../../assets/LoginCartoon.png";
import GoogleLogo from "../../assets/GoogleLogo.png";

import { useNavigate } from "react-router-dom";

const Userlogin = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="userlogin-page">

        <div className="userlogin-container">

          {/* LEFT SIDE IMAGE */}

          <div className="userlogin-box1">

            <img
              src={LoginCartoon}
              alt="Login Cartoon"
              className="userlogin-img3"
            />

          </div>

          {/* RIGHT SIDE LOGIN FORM */}

          <div className="userlogin-box2">

            <div className="userlogin-login">

              <h3>LOGIN</h3>

              <p>
                Login to access your TravelWise account
              </p>

            </div>

            {/* EMAIL */}

            <div className="userlogin-input-box">

              <input
                type="email"
                placeholder="Email"
              />

            </div>

            {/* PASSWORD */}

            <div className="userlogin-input-box">

              <input
                type="password"
                placeholder="Password"
              />

            </div>

            {/* OPTIONS */}

            <div className="userlogin-option">

              <label className="userlogin-remember">

                <input type="checkbox" />

                Remember Me

              </label>

              <a href="#" className="userlogin-forgot">
                Forgot Password?
              </a>

            </div>

            {/* LOGIN BUTTON */}

            <div className="userlogin-login-btn">

              <div className="userlogin-btn-box">

                <button className="userlogin-btn">
                  LOGIN
                </button>

              </div>

              {/* SIGNUP */}

              <div className="userlogin-sign-up">

                <p>
                  Don't have an account?

                  <span
                    onClick={() => navigate("/UserSignup")}
                  >
                    {" "}Sign Up
                  </span>

                </p>

              </div>

              {/* LOGIN WITH */}

              <div className="userlogin-login-with">

                <p>
                  <span>Or login with</span>
                </p>

              </div>

              {/* GOOGLE BUTTON */}

              <div className="userlogin-google-btn">

                <button className="userlogin-btn2">

                  <img
                    src={GoogleLogo}
                    alt="Google Logo"
                    className="userlogin-img4"
                  />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Userlogin;