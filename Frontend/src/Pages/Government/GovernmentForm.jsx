import React, { useState, useEffect } from "react";
import "../../Styles/GovernmentForm.css";
import Navbar from "../../Layout/Navbar.jsx";

const Verification = () => {
  
  const [colleges, setColleges] = useState([]);
  
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [formData, setFormData] = useState({
    performanceScore: "",
    verified: "false",
    rank: "",
    verificationDate: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/government/all-colleges", {
          method: "GET",
          credentials: "include", 
        });
        const data = await response.json();
        
        if (response.ok) {
          setColleges(data.data);
        } else {
          console.error("Failed to fetch colleges");
        }
      } catch (err) {
        console.error("Error fetching colleges:", err);
      }
    };

    fetchColleges();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedCollegeId) {
      setError("Please select a college to verify.");
      return;
    }

    const payload = {
      performanceScore: Number(formData.performanceScore),
      rank: Number(formData.rank),
      verified: formData.verified === "true",
      verificationDate: formData.verificationDate,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/v1/government/verify-college/${selectedCollegeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update college verification");
      }

      setMessage(data.message);
      setFormData({
        performanceScore: "",
        verified: "false",
        rank: "",
        verificationDate: "",
      });
      setSelectedCollegeId("");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>

      <div className="verification-container">
        <h3>Verification</h3>

        {message && <p className="verification-success">{message}</p>}
        {error && <p className="verification-error">{error}</p>}

        
        <form className="verification-form-wrapper" onSubmit={handleSubmit}>
          
          <div className="verification-form-field1">
            <h4>College Name</h4>
            <div className="verification-field">
              
              <select 
                value={selectedCollegeId} 
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                required
              >
                <option value="" disabled>Select a College</option>
                {colleges.map((col) => (
                  <option key={col._id} value={col._id}>
                    {col.collegeName} ({col.location})
                  </option>
                ))}
              </select>
            </div>

            <h4>College Performance (Score)</h4>
            <div className="verification-field">
              <input 
                type="number" 
                name="performanceScore"
                value={formData.performanceScore}
                onChange={handleChange}
                required 
              />
            </div>

            <h4>Verified or Not</h4>
            <div className="verification-field">
              <select 
                name="verified"
                value={formData.verified}
                onChange={handleChange}
                required
              >
                <option value="false">Not Verified (False)</option>
                <option value="true">Verified (True)</option>
              </select>
            </div>
          </div>

          
          <div className="verification-form-field2">
            <h4>College Rank</h4>
            <div className="verification-field">
              <input 
                type="number" 
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                required 
              />
            </div>

            <h4>Date of Verification</h4>
            <div className="verification-field">
              <input 
                type="date" 
                name="verificationDate"
                value={formData.verificationDate}
                onChange={handleChange}
                required 
              />
            </div>

           
            <button type="submit" className="verification-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Verification;