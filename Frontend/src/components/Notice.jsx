import React, { useState, useEffect } from "react";
import "../Styles/Notice.css";
import Notification from "../assets/Notificationimage.png";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE ||
    "https://techsaarthi.onrender.com";

  function timeAgo(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return diff + "s ago";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "hrs ago";
    return Math.floor(diff / 86400) + "d ago";
  }

  const fetchNotices = async () => {
    setFetchLoading(true);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/notice/all-notices`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const isJson = res.headers
          .get("content-type")
          ?.includes("application/json");

        const data = isJson ? await res.json() : null;

        throw new Error(
          data?.message || `HTTP Error ${res.status}`
        );
      }

      const data = await res.json();

      setNotices(data.data || []);
    } catch (err) {
      console.error(
        "Error fetching notices:",
        err.message
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSelectedNotice(null);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, []);

  return (
    <>
      <div className="notice-container">
        <div className="notice-box">
          <div className="notice-header">
            <img src={Notification} alt="Notification" />
            <span>Important Alerts</span>
          </div>

          <div className="alerts-list">
            {fetchLoading ? (
              <div className="notice-loading">
                Loading notices...
              </div>
            ) : notices.length === 0 ? (
              <div className="notice-loading">
                No notices available.
              </div>
            ) : (
              notices.map((notice) => (
                <div
                  className="alert-item"
                  key={notice._id}
                >
                  <span>
                    {notice.title}

                    <button
                      className="notice-view-btn"
                      onClick={() =>
                        setSelectedNotice(notice)
                      }
                    >
                      Click Here to View
                    </button>
                  </span>

                  <span className="alert-time">
                    {timeAgo(notice.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}

      {selectedNotice && (
        <div
          className="notice-overlay"
          onClick={() =>
            setSelectedNotice(null)
          }
        >
          <div
            className="notice-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="notice-modal-close"
              onClick={() =>
                setSelectedNotice(null)
              }
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="notice-modal-header">
              <img
                src={Notification}
                alt=""
                style={{ height: "36px" }}
              />

              <span>
                {selectedNotice.title}
              </span>
            </div>

            <div className="notice-modal-body">
              {selectedNotice.document ? (
                selectedNotice.document.endsWith(
                  ".pdf"
                ) ? (
                  <div
                    className="notice-modal-fallback"
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                    }}
                  >
                    <i
                      className="fa-solid fa-file-pdf"
                      style={{
                        fontSize: "60px",
                        color: "#e74c3c",
                        marginBottom: "15px",
                      }}
                    ></i>

                    <h3
                      style={{
                        marginBottom: "10px",
                        color: "#333",
                      }}
                    >
                      PDF Document
                    </h3>

                    <p
                      style={{
                        color: "#666",
                        marginBottom: "20px",
                      }}
                    >
                      Click below to read or
                      download the notice.
                    </p>

                    <a
                      href={selectedNotice.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notice-download-btn"
                      style={{
                        padding: "10px 20px",
                        backgroundColor:
                          "#007bff",
                        color: "#fff",
                        borderRadius: "5px",
                        textDecoration:
                          "none",
                        display:
                          "inline-block",
                      }}
                    >
                      <i className="fa-solid fa-book-open"></i>{" "}
                      Read Full Notice
                    </a>
                  </div>
                ) : selectedNotice.document.includes(
                    "cloudinary"
                  ) ? (
                  <img
                    src={
                      selectedNotice.document
                    }
                    alt={
                      selectedNotice.title
                    }
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    className="notice-modal-fallback"
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                    }}
                  >
                    <i
                      className="fa-solid fa-file-word"
                      style={{
                        fontSize: "60px",
                        color: "#2980b9",
                        marginBottom: "15px",
                      }}
                    ></i>

                    <p
                      style={{
                        color: "#666",
                        marginBottom: "20px",
                      }}
                    >
                      Preview not available
                      for this file type.
                    </p>

                    <a
                      href={selectedNotice.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notice-download-btn"
                      style={{
                        padding: "10px 20px",
                        backgroundColor:
                          "#007bff",
                        color: "#fff",
                        borderRadius: "5px",
                        textDecoration:
                          "none",
                        display:
                          "inline-block",
                      }}
                    >
                      <i className="fa-solid fa-download"></i>{" "}
                      Download Document
                    </a>
                  </div>
                )
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No document attached.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notice;