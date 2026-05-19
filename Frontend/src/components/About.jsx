import React from "react";
import Navbar from "../Layout/Navbar.jsx";
import "../Styles/About.css";
import About1 from "../assets/about1.png";
import About2 from "../assets/about2.png";

const About = () => {
  return (
    <>
      <Navbar />

      <div className="about-container">
        <div className="about-img-wrapper">
          <img src={About1} alt="About Banner" className="about-img" />

          <div className="about-us">
            <h2>About Us</h2>
            <p>
              TechSaarthi is a smart and student-friendly platform designed to
              simplify the college admission journey. It creates an environment
              where students can easily discover the best colleges based on
              their preferences, such as rank, location, course, and budget.
              Instead of struggling with scattered information and confusing
              processes, TechSaarthi brings everything together in one place for
              a smooth and guided experience.
            </p>

            <br />

            <p>
              Our platform offers a range of powerful features, including an
              AI-powered chatbot for instant query resolution, personalized
              college recommendations, comparison tools, and real-time insights
              to help students make confident decisions. With a focus on
              accessibility, clarity, and innovation, TechSaarthi aims to bridge
              the gap between students and the right opportunities, making
              higher education choices simpler, faster, and more reliable.
            </p>
          </div>
        </div>

        {/* CONTACT IMAGE */}

        <img src={About2} alt="Contact Banner" className="about-img" />

        {/* CONTACT SECTION */}

        <div className="about-contact">
          <h2>Contact Us</h2>

          <p>
            We’d love to hear from you! Whether you have questions, feedback, or
            need assistance, the TechSaarthi team is here to help you at every
            step of your journey. Feel free to reach out to us for any queries
            related to college recommendations, platform features, or general
            support. Our goal is to ensure that your experience with TechSaarthi
            is smooth, reliable, and helpful.
          </p>

          <br />

          <p>
            Email: support@techsaarthi.com
            <br />
            Phone: +91 98765 43210
            <br />
            Website: www.techsaarthi.com
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
