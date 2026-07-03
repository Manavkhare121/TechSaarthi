import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/GovernmentForm.css";
                             
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

const BACKEND_URL =
import.meta.env.VITE_API_BASE || "https://techsaarthi.onrender.com";

useEffect(() => {
fetchColleges();
}, []);

const fetchColleges = async () => {
try {
const response = await axios.get(
`${BACKEND_URL}/api/v1/government/all-colleges`,
{
withCredentials: true,
}
);

  setColleges(response.data.data);
} catch (err) {
  console.error(
    err.response?.data?.message ||
      "Failed to fetch colleges"
  );
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

if (!selectedCollegeId) {
  setError("Please select a college to verify.");
  return;
}

try {
  const response = await axios.patch(
    `${BACKEND_URL}/api/v1/government/verify-college/${selectedCollegeId}`,
    {
      performanceScore: Number(formData.performanceScore),
      rank: Number(formData.rank),
      verified: formData.verified === "true",
      verificationDate: formData.verificationDate,
    },
    {
      withCredentials: true,
    }
  );

  setMessage(response.data.message);

  setFormData({
    performanceScore: "",
    verified: "false",
    rank: "",
    verificationDate: "",
  });

  setSelectedCollegeId("");

  fetchColleges();
} catch (err) {
  setError(
    err.response?.data?.message ||
      "Failed to update college verification"
  );
}


};

return ( <div className="gov-container"> <h3 className="gov-title">
Verification </h3>


  {message && (
    <p className="gov-success">{message}</p>
  )}

  {error && (
    <p className="gov-error">{error}</p>
  )}

  <form
    className="gov-form-wrapper"
    onSubmit={handleSubmit}
  >
    <div className="gov-form-field1">
      <h4>College Name</h4>

      <div className="gov-field">
        <select
          value={selectedCollegeId}
          onChange={(e) =>
            setSelectedCollegeId(e.target.value)
          }
          required
        >
          <option value="">
            Select College
          </option>

          {colleges.map((college) => (
            <option
              key={college._id}
              value={college._id}
            >
              {college.collegeName} (
              {college.location})
            </option>
          ))}
        </select>
      </div>

      <h4>College Performance Score</h4>

      <div className="gov-field">
        <input
          type="number"
          name="performanceScore"
          value={formData.performanceScore}
          onChange={handleChange}
          required
        />
      </div>

      <h4>Verified Status</h4>

      <div className="gov-field">
        <select
          name="verified"
          value={formData.verified}
          onChange={handleChange}
        >
          <option value="false">
            Not Verified
          </option>
          <option value="true">
            Verified
          </option>
        </select>
      </div>
    </div>

    <div className="gov-form-field2">
      <h4>College Rank</h4>

      <div className="gov-field">
        <input
          type="number"
          name="rank"
          value={formData.rank}
          onChange={handleChange}
          required
        />
      </div>

      <h4>Date of Verification</h4>

      <div className="gov-field">
        <input
          type="date"
          name="verificationDate"
          value={formData.verificationDate}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="gov-btn"
      >
        Submit
      </button>
    </div>
  </form>

  {/* ALL COLLEGES */}

  {colleges.length > 0 && (
    <div className="gov-results">
      <h4 className="gov-result-title">
        All Colleges
      </h4>

      <div className="gov-card-container">
        {colleges.map((college) => (
          <div
            key={college._id}
            className="gov-card"
          >
            <div className="gov-card-header">
              <h3>{college.collegeName}</h3>

              <span className="gov-rank">
                Rank #
                {college.rank || "N/A"}
              </span>
            </div>

            <div className="gov-details">
              <p>
                <strong>Location:</strong>{" "}
                {college.location}
              </p>

              <p>
                <strong>State:</strong>{" "}
                {college.state}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {college.departmentName}
              </p>

              <p>
                <strong>Performance Score:</strong>{" "}
                {college.performanceScore ||
                  0}
              </p>

              <p>
                <strong>Verified:</strong>{" "}
                {college.verified
                  ? "Yes ✅"
                  : "No ❌"}
              </p>

              <p>
                <strong>
                  Verification Date:
                </strong>{" "}
                {college.verificationDate
                  ? new Date(
                      college.verificationDate
                    ).toLocaleDateString()
                  : "Not Verified"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>


);
};

export default Verification;
