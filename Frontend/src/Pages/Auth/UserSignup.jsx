import React from "react";
import "../../Styles/UserSignup.css";
import SignupCartoon from "../../assets/SignupCartoon.png";
import GoogleLogo from "../../assets/GoogleLogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Usersignup = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_BASE || "https://techsaarthi.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value;
    const username = (firstName + lastName).toLowerCase();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/register`,
        {
          username,
          email,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      navigate("/Userlogin");
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="usersignup-page">
      <div className="usersignup-container">
        <div className="usersignup-box1">
          <img
            src={SignupCartoon}
            alt="Signup Cartoon"
            className="usersignup-img5"
          />
        </div>

        <div className="usersignup-box2">
          <div className="usersignup-login">
            <h3>SIGN UP</h3>
            <p>
              Let’s get you all set up so you can access your personal account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="usersignup-name-row">
              <div className="usersignup-fullname">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </div>

              <div className="usersignup-lastname">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="usersignup-input-box">
              <input type="email" name="email" placeholder="Email" required />
            </div>

            <div className="usersignup-input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="usersignup-input-box">
              <select name="role">
                <option value="user">User</option>
                <option value="college">College</option>
                <option value="government">Government</option>
              </select>
            </div>

            <div className="usersignup-option">
              <label className="usersignup-remember">
                <input type="checkbox" required />I agree to the Terms and
                Privacy Policies
              </label>
            </div>

            <button type="submit" className="usersignup-btn">
              Create Account
            </button>
          </form>

          <div className="usersignup-sign-up">
            <p>
              Already have an account?
              <span onClick={() => navigate("/Userlogin")}> Login</span>
            </p>
          </div>

          <div className="usersignup-login-with">
            <p>
              <span>Or signup with</span>
            </p>
          </div>

          {/* Styled Google Signup Button */}
          <div
            className="usersignup-btn2"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "15px",
            }}
          >
            <GoogleLogin
              size="large"
              width="320" // Login page ki tarah isko bhi adjust kar sakte hain 
              theme="outline"
              text="signup_with" // Text yahan 'signup_with' kar diya hai
              shape="rectangular"
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await axios.post(
                    `${BACKEND_URL}/api/v1/auth/google`,
                    {
                      credential: credentialResponse.credential,
                    },
                    {
                      withCredentials: true,
                    }
                  );

                  console.log(response.data);

                  navigate("/About");
                } catch (err) {
                  console.log(err);
                }
              }}
              onError={() => {
                console.log("Google Signup Failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usersignup;