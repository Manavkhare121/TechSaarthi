import React from "react";
import "../../Styles/UserSignup.css";

import SignupCartoon from "../../assets/SignupCartoon.png";
import GoogleLogo from "../../assets/GoogleLogo.png";
import { useNavigate } from "react-router-dom";
const Usersignup = () => {
  const navigate = useNavigate();
  return (
    <div className="usersignup-page">
      <div className="usersignup-container">
        {/* LEFT IMAGE SECTION */}

        <div className="usersignup-box1">
          <img
            src={SignupCartoon}
            alt="Signup Cartoon"
            className="usersignup-img5"
          />
        </div>

        {/* RIGHT FORM SECTION */}

        <div className="usersignup-box2">
          <div className="usersignup-login">
            <h3>SIGN UP</h3>

            <p>
              Let’s get you all set up so you can access your personal account.
            </p>
          </div>

          {/* NAME ROW */}

          <div className="usersignup-name-row">
            <div className="usersignup-fullname">
              <input type="text" placeholder="First Name" />
            </div>

            <div className="usersignup-lastname">
              <input type="text" placeholder="Last Name" />
            </div>
          </div>

          {/* EMAIL */}

          <div className="usersignup-input-box">
            <input type="email" placeholder="Email" />
          </div>

          {/* PASSWORD */}

          <div className="usersignup-input-box">
            <input type="password" placeholder="Password" />
          </div>
          <div className="usersignup-input-box">
            <select>
              <option value="user">User</option>

              <option value="college">College</option>
              <option value="college">Government</option>
            </select>
          </div>

          {/* TERMS */}

          <div className="usersignup-option">
            <label className="usersignup-remember">
              <input type="checkbox" />I agree to the Terms and Privacy Policies
            </label>
          </div>

          {/* BUTTON */}

          <button className="usersignup-btn">Create Account</button>

          {/* LOGIN */}

          <div className="usersignup-sign-up">
            <p>
              Already have an account?
              <span onClick={() => navigate("/Userlogin")}> Login</span>
            </p>
          </div>

          {/* OR SIGNUP WITH */}

          <div className="usersignup-login-with">
            <p>
              <span>Or signup with</span>
            </p>
          </div>

          {/* GOOGLE BUTTON */}

          <button className="usersignup-btn2">
            <img
              src={GoogleLogo}
              alt="Google Logo"
              className="usersignup-img4"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usersignup;
