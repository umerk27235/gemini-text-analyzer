import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Input, Button, Typography, Alert, Spin, Card } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

const Dictaphone = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!userInput.trim()) {
      setError("Please enter some text.");
      return;
    }

    setError(null);
    setLoading(true);
    setResponse("");

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const result = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: userInput }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result.data && result.data.candidates) {
        const rawResponse =
          result.data.candidates[0]?.content?.parts[0]?.text ||
          "No content returned.";
        setResponse(formatResponse(rawResponse));
      } else {
        setError("No valid response received from Gemini.");
      }
    } catch (err) {
      console.error("Error analyzing text:", err);
      setError("An error occurred while communicating with Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (responseText) => {
    return responseText
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1\n\n")
      .replace(/([a-z])([A-Z])/g, "$1. $2")
      .trim();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: "#1E1E1E",
        color: "#E0E0E0",
        padding: "20px",
      }}
    >
      <Title level={3} style={{ color: "#ffffff", textAlign: "center" }}>
        Enter your text below:
      </Title>

      <TextArea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={5}
        placeholder="Type something here..."
        style={{
          backgroundColor: "#2E2E2E",
          color: "#ffffff",
          borderRadius: "8px",
          width: "500px",
        }}
      />

      <Button
        type="primary"
        onClick={analyzeText}
        disabled={loading}
        style={{
          marginTop: "10px",
          backgroundColor: "#1677ff",
          borderColor: "#1677ff",
          width: "200px",
        }}
      >
        {loading ? <Spin size="small" /> : "Analyze Text"}
      </Button>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginTop: "10px", width: "500px" }}
        />
      )}

      {response && (
        <Card
          style={{
            marginTop: "20px",
            background: "#2E2E2E",
            color: "#E0E0E0",
            padding: "15px",
            borderRadius: "8px",
            width: "500px",
          }}
        >
          <Title level={4} style={{ color: "#ffffff", textAlign: "center" }}>
            Analysis Result:
          </Title>
          <ReactMarkdown>{response}</ReactMarkdown>
        </Card>
      )}
    </div>
  );
};

export default Dictaphone;
