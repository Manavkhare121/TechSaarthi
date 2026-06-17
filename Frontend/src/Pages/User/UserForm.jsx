import React, { useState } from "react";
import Navbar from "../../Layout/Navbar.jsx";
import "../../Styles/UserForm.css";
import axios from "axios";

const CollegeInfo = () => {
  const [formData, setFormData] = useState({
    jeePercentile: "",
    cuetPercentile: "",
    class12Marks: "",
    preferredDepartment: "CSE",
  });
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState("");
  
  const BACKEND_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    try {
      setError("");
     const response = await axios.post(
  `${BACKEND_URL}/api/v1/user/eligible-colleges`,
  {
    jeePercentile: Number(formData.jeePercentile),
    cuetPercentile: Number(formData.cuetPercentile),
    class12Marks: Number(formData.class12Marks),
    preferredDepartment: formData.preferredDepartment,
  },
  {
    withCredentials: true,
  }
);

console.log("Response:", response.data);

setColleges(response.data.data);
      setColleges(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch colleges");
    }
  };

  return (
    <>
      <div className="college-container">
        <h3 className="college-title">College Information</h3>

        <div className="college-row">
          {/* JEE */}
          <div className="college-field">
            <h4>JEE Percentile</h4>
            <input
              type="text"
              name="jeePercentile"
              value={formData.jeePercentile}
              onChange={handleChange}
              placeholder=""
            />
          </div>

          {/* CUET */}
          <div className="college-field">
            <h4>CUET Percentile</h4>
            <input
              type="text"
              name="cuetPercentile"
              value={formData.cuetPercentile}
              onChange={handleChange}
              placeholder=""
            />
          </div>

          {/* 12th MARKS */}
          <div className="college-field">
            <h4>12th Marks</h4>
            <input
              type="text"
              name="class12Marks"
              value={formData.class12Marks}
              onChange={handleChange}
              placeholder=""
            />
          </div>

          <div className="college-field">
            <h4>Department Name</h4>
            <select
              name="preferredDepartment"
              value={formData.preferredDepartment}
              onChange={handleChange}
            >
              <option value="CSE">CSE</option>
              <option value="CSE-DS">CSE-DS</option>
              <option value="CSE-AIML">CSE-AIML</option>
            </select>
          </div>

          {/* BUTTON */}
          <button className="college-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

        {colleges.length > 0 && (
  <div className="college-results">
    <h4 className="result-title">Matching Colleges</h4>

    <div className="college-card-container">
      {colleges.map((college) => (
        <div key={college._id} className="college-card">
          <div className="college-card-header">
            <h3>{college.collegeName}</h3>
            <span className="college-rank">
              Rank #{college.rank}
            </span>
          </div>

          <div className="college-details">
            <p>
              <strong>Location:</strong> {college.location},{" "}
              {college.state}
            </p>

            <p>
              <strong>College Type:</strong>{" "}
              {college.collegeType}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {college.departmentName}
            </p>

            <p>
              <strong>JEE Cutoff:</strong>{" "}
              {college.jeeCutoff}
            </p>

            <p>
              <strong>CUET Cutoff:</strong>{" "}
              {college.cuetCutoff}
            </p>

            <p>
              <strong>12th Cutoff:</strong>{" "}
              {college.class12Cutoff}%
            </p>

            <p>
              <strong>Fees:</strong> ₹
              {college.fees?.toLocaleString()}
            </p>

            <p>
              <strong>Hostel Available:</strong>{" "}
              {college.hostelAvailable ? "Yes" : "No"}
            </p>

            <p>
              <strong>Hostel Fees:</strong> ₹
              {college.hostelFees?.toLocaleString()}
            </p>

            <p>
              <strong>Boys Hostel:</strong>{" "}
              {college.boysHostel ? "Yes" : "No"}
            </p>

            <p>
              <strong>Girls Hostel:</strong>{" "}
              {college.girlsHostel ? "Yes" : "No"}
            </p>

            <p>
              <strong>Mess Available:</strong>{" "}
              {college.messAvailable ? "Yes" : "No"}
            </p>

            <p>
              <strong>Verified:</strong>{" "}
              {college.verified ? "Yes ✅" : "No ❌"}
            </p>

            <p>
              <strong>Performance Score:</strong>{" "}
              {college.performanceScore}
            </p>

            <p>
              <strong>Verification Date:</strong>{" "}
              {new Date(
                college.verificationDate
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default CollegeInfo;