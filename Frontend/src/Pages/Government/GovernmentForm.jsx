import React from "react";
import "../../Styles/GovernmentForm.css";
import Navbar from "../../Layout/Navbar.jsx";

const Verification = () => {
  return (
    <>
      <div className="verification-container">

        <h3>Verification</h3>

        <div className="verification-form-wrapper">


          <div className="verification-form-field1">

            <h4>College Name</h4>

            <div className="verification-field">
              <input type="text" />
            </div>

            <h4>College Performance</h4>

            <div className="verification-field">
              <input type="text" />
            </div>

            <h4>Verified or Not</h4>

            <div className="verification-field">
              <input type="text" />
            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="verification-form-field2">

            <h4>College Rank</h4>

            <div className="verification-field">
              <input type="text" />
            </div>

            <h4>Date of Verification</h4>

            <div className="verification-field">
              <input type="text" />
            </div>

            <button className="verification-btn">
              Search
            </button>

          </div>

        </div>

      </div>

    </>
  );
};

export default Verification;