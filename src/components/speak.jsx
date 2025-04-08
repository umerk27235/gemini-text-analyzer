import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Input, Button, Spin, Avatar } from "antd";

const { TextArea } = Input;

const GeminiTextAnalyzer = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!userInput.trim()) return;

    const input = userInput.trim();
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setUserInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const result = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: input }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResponse =
        result.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No content returned.";
      const formatted = formatResponse(rawResponse);
      setMessages((prev) => [...prev, { type: "ai", text: formatted }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "⚠️ Error getting response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) =>
    text
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1\n\n")
      .replace(/([a-z])([A-Z])/g, "$1. $2")
      .trim();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      analyzeText();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f7f7f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Text Analyzer
      </h1>
      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "700px",
          overflowY: "auto",
          marginBottom: "80px",
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: messages.length === 0 ? "flex" : "block", // Ensure the window has a minimal layout if no messages
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "18px",
              fontStyle: "italic",
            }}
          >
            No conversation yet. Start typing below!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: "16px",
                display: "flex",
                flexDirection: msg.type === "user" ? "row-reverse" : "row",
              }}
            >
              <Avatar
                style={{
                  backgroundColor: msg.type === "user" ? "#1677ff" : "#999",
                  marginRight: msg.type === "user" ? "10px" : "0",
                  marginLeft: msg.type === "ai" ? "10px" : "0",
                }}
              >
                {msg.type === "user" ? "U" : "A"}
              </Avatar>
              <div
                style={{
                  backgroundColor: msg.type === "user" ? "#1677ff" : "#e0e0e0",
                  color: msg.type === "user" ? "#fff" : "#333",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                  lineHeight: "1.5",
                }}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={{ color: "#999", marginTop: "10px" }}>
            <Spin /> Analyzing...
          </div>
        )}
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#fff",
          padding: "10px 20px",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <TextArea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onPressEnter={handleKeyPress}
          rows={2}
          placeholder="Type your message and press Enter..."
          style={{
            backgroundColor: "#f7f7f7",
            color: "#333",
            borderRadius: "30px",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        />
        <Button
          type="primary"
          onClick={analyzeText}
          loading={loading}
          style={{
            marginTop: "10px",
            width: "100%",
            borderRadius: "30px",
            backgroundColor: "#1677ff",
            borderColor: "#1677ff",
          }}
        >
          Analyze Text
        </Button>
      </div>
    </div>
  );
};

export default GeminiTextAnalyzer;
