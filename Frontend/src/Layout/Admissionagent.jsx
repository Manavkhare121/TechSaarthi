import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../Styles/Admissionagent.css";

export default function AdmissionAgent() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "Namaste! 👋 Mujhe batao — kaun se college mein admission chahiye aur tumhara percentile kya hai?",
      type: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE ||
    "https://techsaarthi.onrender.com";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        text,
        type: "user",
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/agent/predict`,
        {
          message: text,
        },
        {
          withCredentials: true,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          text: data.response,
          type: "bot",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Server se connect nahi ho paya. Dobara try karo.",
          type: "bot",
        },
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aa-wrapper">
      {isOpen && (
        <div className="aa-window">
          <div className="aa-header">
            <div className="aa-header-avatar">🎓</div>

            <div className="aa-header-info">
              <span className="aa-header-title">
                Admission Agent
              </span>
            </div>

            <button
              className="aa-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="aa-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`aa-msg ${msg.type}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="aa-loading">
                Soch raha hoon...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="aa-input-bar">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              placeholder="Percentile aur college likho..."
            />

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        className="aa-toggle-btn"
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        aria-label="Admission Agent kholo"
      >
        🎓
      </button>
    </div>
  );
}