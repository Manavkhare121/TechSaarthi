import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Layout/Navbar";
import "../../Styles/CollegeForm.css";
const CollegeForm = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeType: "",
    state: "",
    departmentName: "",
    jeeCutoff: "",
    cuetCutoff: "",
    location: "",
    class12Cutoff: "",
    fees: "",
    hostelAvailable: "false",
    hostelFees: "",
    collegePhone: "",
    scholarshipAvailable: "false",
    scholarshipDetails: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [college, setCollege] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  useEffect(() => {
    fetchCollege();
  }, []);

  const fetchCollege = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/college/my-college`,
        {
          withCredentials: true,
        },
      );

      setCollege(response.data.data);
    } catch (err) {
      console.log("College not found yet");
    }
  };

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

    const payload = {
      ...formData,
      jeeCutoff: Number(formData.jeeCutoff),
      cuetCutoff: Number(formData.cuetCutoff),
      class12Cutoff: Number(formData.class12Cutoff),
      fees: Number(formData.fees),
      hostelFees: Number(formData.hostelFees),
      hostelAvailable: formData.hostelAvailable === "true",
      collegePhone: formData.collegePhone,
      scholarshipAvailable: formData.scholarshipAvailable === "true",
      scholarshipDetails: formData.scholarshipDetails,
    };

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/college/create-college`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);

      fetchCollege();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="collegeform-container">
        <h3 className="collegeform-title">College Information</h3>

        {message && <p className="collegeform-success-msg">{message}</p>}

        {error && <p className="collegeform-error-msg">{error}</p>}

        <form className="collegeform-form-wrapper" onSubmit={handleSubmit}>
          <div className="collegeform-row">
            <div className="collegeform-field collegeform-big">
              <h4>College Name</h4>

              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>Type</h4>

              <input
                type="text"
                name="collegeType"
                value={formData.collegeType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>State</h4>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="collegeform-row">
            <div className="collegeform-field collegeform-big">
              <h4>Department Name</h4>

              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
              />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>JEE Cutoff</h4>

              <input
                type="number"
                name="jeeCutoff"
                value={formData.jeeCutoff}
                onChange={handleChange}
              />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>CUET Cutoff</h4>

              <input
                type="number"
                name="cuetCutoff"
                value={formData.cuetCutoff}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="collegeform-row">
            <div className="collegeform-field collegeform-big">
              <h4>Location</h4>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>12th Marks</h4>

              <input
                type="number"
                name="class12Cutoff"
                value={formData.class12Cutoff}
                onChange={handleChange}
              />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>Fees</h4>

              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="collegeform-row">
            <div className="collegeform-field collegeform-big">
              <h4>Scholarship Details</h4>

              <input
                type="text"
                name="scholarshipDetails"
                value={formData.scholarshipDetails}
                onChange={handleChange}
              />
            </div>
            <div className="collegeform-field collegeform-small">
              <h4>Scholarship Available</h4>

              <select
                name="scholarshipAvailable"
                value={formData.scholarshipAvailable}
                onChange={handleChange}
                className="collegeform-select"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="collegeform-field collegeform-small">
              <h4>College Phone</h4>

              <input
                type="text"
                name="collegePhone"
                value={formData.collegePhone}
                onChange={handleChange}
              />
            </div>
            
          </div>

          <h3 className="collegeform-hostel-info">Hostel Information</h3>

          <div className="collegeform-row collegeform-hostel-section">
            <div className="collegeform-field collegeform-big">
              <h4>Hostel Availability</h4>

              <select
                name="hostelAvailable"
                value={formData.hostelAvailable}
                onChange={handleChange}
                className="collegeform-select"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="collegeform-field collegeform-small collegeform-fees">
              <h4>Hostel Fees</h4>

              <input
                type="number"
                name="hostelFees"
                value={formData.hostelFees}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="collegeform-btn">
              Submit
            </button>
          </div>
        </form>

        {/* COLLEGE CARD */}

        {college && (
          <div className="collegeform-card">
            <div className="collegeform-card-header">
              <h3>{college.collegeName}</h3>

              <span className="collegeform-badge">
                {college.verified ? "Verified ✅" : "Pending ⏳"}
              </span>
            </div>

            <div className="collegeform-card-details">
              <p>
                <strong>State:</strong> {college.state}
              </p>

              <p>
                <strong>Location:</strong> {college.location}
              </p>

              <p>
                <strong>Type:</strong> {college.collegeType}
              </p>

              <p>
                <strong>Department:</strong> {college.departmentName}
              </p>

              <p>
                <strong>JEE Cutoff:</strong> {college.jeeCutoff}
              </p>

              <p>
                <strong>CUET Cutoff:</strong> {college.cuetCutoff}
              </p>

              <p>
                <strong>12th Cutoff:</strong> {college.class12Cutoff}
              </p>

              <p>
                <strong>Fees:</strong> ₹{college.fees?.toLocaleString()}
              </p>

              <p>
                <strong>Hostel:</strong>{" "}
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
                <strong>Phone:</strong>

                {college.collegePhone}
              </p>

              <p>
                <strong>Scholarship:</strong>

                {college.scholarshipAvailable ? "Yes" : "No"}
              </p>

              <p>
                <strong>Rank:</strong> {college.rank || "N/A"}
              </p>

              <p>
                <strong>Performance:</strong>{" "}
                {college.performanceScore || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CollegeForm;
