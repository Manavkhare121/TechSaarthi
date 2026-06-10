import React from "react";
import Navbar from "../../Layout/Navbar";
import "../../Styles/CollegeForm.css";

const CollegeForm = () => {
  return (
    <>

      <div className="collegeform-container">

        <h3 className="collegeform-title">
          College Information
        </h3>

        <div className="collegeform-form-wrapper">

          {/* ROW 1 */}

          <div className="collegeform-row">

            <div className="collegeform-field collegeform-big">

              <h4>College Name</h4>

              <input type="text" />

            </div>

            <div className="collegeform-field collegeform-small">

              <h4>Type</h4>

              <input type="text" />

            </div>

            <div className="collegeform-field collegeform-small">

              <h4>State</h4>

              <input type="text" />

            </div>

          </div>

          {/* ROW 2 */}

          <div className="collegeform-row">

            <div className="collegeform-field collegeform-big">

              <h4>Department Name</h4>

              <input type="text" />

            </div>

            <div className="collegeform-field collegeform-small">

              <h4>JEE Cutoff</h4>

              <input type="text" />

            </div>

            <div className="collegeform-field collegeform-small">

              <h4>CUET Cutoff</h4>

              <input type="text" />

            </div>

          </div>

          {/* ROW 3 */}

          <div className="collegeform-row">

            <div className="collegeform-field collegeform-big">

              <h4>Location</h4>

              <input type="text" />

            </div>

            <div className="collegeform-field collegeform-small">

              <h4>12th Marks</h4>

              <input type="text" />

            </div>

            <div className="collegeform-field collegeform-small">

              <h4>Fees</h4>

              <input type="text" />

            </div>

          </div>

          {/* HOSTEL INFO */}

          <h3 className="collegeform-hostel-info">
            Hostel Information
          </h3>

          <div className="collegeform-row collegeform-hostel-section">

            <div className="collegeform-field collegeform-big">

              <h4>Hostel Availability</h4>

              <input type="text" />

            </div>

            <div className="collegeform-field collegeform-small collegeform-fees">

              <h4>Fees</h4>

              <input type="text" />

            </div>

            <button className="collegeform-btn">
              Search
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default CollegeForm;