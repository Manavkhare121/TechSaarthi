import { useState, useRef } from "react";
import "../Styles/Helpline.css"

const BACKEND_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const Helpline = () => {
  const [query, setQuery] = useState("");
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const debounceRef = useRef(null);

  const searchColleges = async (searchQuery) => {
    const q = (searchQuery ?? query).trim();
    if (!q) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/college/search?name=${encodeURIComponent(q)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setColleges(data.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setColleges([]);
      setSearched(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchColleges(val), 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchColleges();
  };

  const copyPhone = (phone, id) => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="hl-container">
      <p className="hl-title">College Helpline Directory</p>

      <div className="hl-row">
        <div className="hl-field">
          <input
            type="text"
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="e.g. IIT Delhi, NIT Bhopal..."
          />
        </div>
        <button className="hl-btn" onClick={() => searchColleges()}>
          Search
        </button>
      </div>

      {/* Results Section */}
      <div className="hl-results">
        {loading && (
          <p className="hl-loading">Searching...</p>
        )}

        {!loading && searched && colleges.length === 0 && (
          <p className="hl-empty">No college found with that name.</p>
        )}

        {!loading && colleges.length > 0 && (
          <>
            <p className="result-title">
              {colleges.length} Result{colleges.length > 1 ? "s" : ""} Found
            </p>

            <div className="hl-card-container">
              {colleges.map((college) => (
                <div className="hl-card" key={college._id}>
                  <div className="hl-card-header">
                    <h3>{college.collegeName}</h3>
                    {(college.location || college.state) && (
                      <span className="hl-location">
                        {[college.location, college.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </div>

                  <div className="hl-phone-box">
                    <span className="hl-phone-icon">📞</span>
                    <div>
                      <p className="hl-phone-label">Contact Number</p>
                      <p className="hl-phone-number">
                        {college.collegePhone || "Not available"}
                      </p>
                    </div>
                    {college.collegePhone && (
                      <button
                        className={`hl-copy-btn ${copiedId === college._id ? "copied" : ""}`}
                        onClick={() => copyPhone(college.collegePhone, college._id)}
                      >
                        {copiedId === college._id ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Helpline;
