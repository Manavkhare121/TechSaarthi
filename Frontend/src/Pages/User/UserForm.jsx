import React from "react";

import Navbar from "../../Layout/Navbar.jsx";

import "../../Styles/UserForm.css";

const CollegeInfo = () => {
  return (
    <>
      <Navbar />

      <div className="college-container">

        <h3 className="college-title">
          College Information
        </h3>

        <div className="college-row">

          {/* JEE */}

          <div className="college-field">

            <h4>JEE Percentile</h4>

            <input
              type="text"
              placeholder=""
            />

          </div>

          {/* CUET */}

          <div className="college-field">

            <h4>CUET Percentile</h4>

            <input
              type="text"
              placeholder=""
            />

          </div>

          {/* 12th MARKS */}

          <div className="college-field">

            <h4>12th Marks</h4>

            <input
              type="text"
              placeholder=""
            />

          </div>
           <div className="college-field">
            <h4>Department Name</h4>
            <select>
              <option value="CSE">CSE</option>

              <option value="CSE-DS">CSE-DS</option>
              <option value="CSE-AIML">CSE-AIML</option>
            </select>
          </div> 

          {/* BUTTON */}

          <button className="college-btn">
            Search
          </button>

        </div>

      </div>
    </>
  );
};

export default CollegeInfo;