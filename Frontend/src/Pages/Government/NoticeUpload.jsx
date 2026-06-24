import React, { useState } from "react";

import "../../Styles/NoticeUpload.css";
import Notification from "../../assets/Notificationimage.png";

const BASE_URL = "http://localhost:3000/api/v1/notice";

const AdminNotice = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const getToken = () => localStorage.getItem("accessToken") || "";

  const handleUpload = async () => {
    setStatusMsg({ text: "", type: "" });

    if (!title.trim()) {
      setStatusMsg({ text: "Please enter a notice title.", type: "error" });
      return;
    }
    if (!file) {
      setStatusMsg({ text: "Please select a document to upload.", type: "error" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("document", file);

    try {
      const res = await fetch(`${BASE_URL}/upload-notice`, {
        method: "POST",
      credentials: "include", 
      body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setStatusMsg({ text: "Notice posted successfully!", type: "success" });
      setTitle("");
      setFile(null);
      document.getElementById("noticeFileInput").value = "";
    } catch (err) {
      setStatusMsg({ text: "Error: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-notice-container">
        <div className="admin-notice-box">

          <div className="admin-notice-header">
            <img src={Notification} alt="" />
            <span>Post Notice</span>
          </div>

          <div className="admin-notice-form">

            <div className="admin-form-group">
              <label>Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. National Level Hackathon 2k26"
              />
            </div>

            <div className="admin-form-group">
              <label>Upload Document (PDF, DOC, JPG, PNG)</label>
              <input
                type="file"
                id="noticeFileInput"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button
              className={`admin-upload-btn ${loading ? "loading" : ""}`}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Post Notice"}
            </button>

            {statusMsg.text && (
              <div className={`admin-status-msg ${statusMsg.type}`}>
                {statusMsg.text}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNotice;
