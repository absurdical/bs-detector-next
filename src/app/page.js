"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [level, setLevel] = useState("medium");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, level }),
      });

      const data = await res.json();
      setResult({ ...data, input: text });
      setText(""); // clear input
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to fetch result" });
    }

    setLoading(false);
  };

  return (
    <main className="bg-[#343541] text-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="space-x-2">
          {["easy", "medium", "hard"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-3 py-1 rounded ${
                level === lvl
                  ? "bg-blue-600 text-white"
                  : "bg-[#444654] text-gray-300 hover:bg-[#555]"
              }`}
            >
              {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4 max-w-2xl w-full mx-auto">
        {/* Output */}
        <div className="space-y-4">
          {loading && (
            <div className="p-4 rounded bg-[#444654]">Analyzing...</div>
          )}

          {result && (
            <div className="space-y-2">
              {/* User input bubble */}
              <div className="p-4 rounded bg-[#444654]">{result.input}</div>

              {/* AI response bubble */}
              <div className="p-4 rounded bg-[#444654]">
                {result.error ? (
                  <p className="text-red-400">{result.error}</p>
                ) : (
                  <>
                    <p>
                      <strong>Rating:</strong> {result.rating}/10
                    </p>
                    <p>
                      <strong>Reason:</strong> {result.reason}
                    </p>
                    <p>
                      <strong>Real Talk:</strong> {result.real_talk}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative mt-4">
          <textarea
            rows="3"
            className="w-full p-4 pr-12 bg-[#444654] text-gray-100 rounded resize-none outline-none"
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <button
            type="submit"
            disabled={!text.trim() || loading}
            className={`absolute bottom-2 right-2 h-10 w-10 rounded-full flex items-center justify-center ${
              text.trim() && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600"
            }`}
          >
            →
          </button>
        </form>
      </div>
    </main>
  );
}
