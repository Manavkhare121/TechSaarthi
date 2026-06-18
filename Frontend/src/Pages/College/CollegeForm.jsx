import React, { useState } from "react";
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
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/college/create-college", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message); 
      
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
              <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} required />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>Type</h4>
              <input type="text" name="collegeType" value={formData.collegeType} onChange={handleChange} required  />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>State</h4>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>

          <div className="collegeform-row">
            <div className="collegeform-field collegeform-big">
              <h4>Department Name</h4>
              <input type="text" name="departmentName" value={formData.departmentName} onChange={handleChange} />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>JEE Cutoff</h4>
              <input type="number" name="jeeCutoff" value={formData.jeeCutoff} onChange={handleChange} />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>CUET Cutoff</h4>
              <input type="number" name="cuetCutoff" value={formData.cuetCutoff} onChange={handleChange} />
            </div>
          </div>

          <div className="collegeform-row">
            <div className="collegeform-field collegeform-big">
              <h4>Location</h4>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>12th Marks</h4>
              <input type="number" name="class12Cutoff" value={formData.class12Cutoff} onChange={handleChange} />
            </div>

            <div className="collegeform-field collegeform-small">
              <h4>Fees</h4>
              <input type="number" name="fees" value={formData.fees} onChange={handleChange} />
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
              <input type="number" name="hostelFees" value={formData.hostelFees} onChange={handleChange} />
            </div>

            <button type="submit" className="collegeform-btn">
              Submit
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default CollegeForm;