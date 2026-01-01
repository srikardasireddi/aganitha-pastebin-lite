"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const createPaste = async () => {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (data.url) setUrl(data.url);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Aganitha Pastebin Lite</h1>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <textarea
          className="w-full h-64 p-4 border rounded-md text-black focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={createPaste}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Create Paste
        </button>
        {url && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">Paste Created!</p>
            <a href={url} className="text-blue-600 break-all underline" target="_blank">
              {url}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}