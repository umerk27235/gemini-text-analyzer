import { useState } from "react";
import axios from "axios";

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
        setError("No response received from Gemini.");
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
    <div>
      <h2>Enter your text below:</h2>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={5}
        cols={40}
        placeholder="Type something here..."
      ></textarea>
      <br />
      <button onClick={analyzeText} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Text"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {response && (
        <div id="response">
          <h3>Analysis Result:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default Dictaphone;
