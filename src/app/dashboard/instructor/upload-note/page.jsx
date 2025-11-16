"use client";

import { useState } from "react";

export default function UploadNotePage() {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/upload-note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ course_id: courseId, title, note_url: noteUrl }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setMessage("✅ Note uploaded successfully!");
      setCourseId("");
      setTitle("");
      setNoteUrl("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-lg mx-auto bg-white p-8 shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Note</h1>
        {message && <p className="text-center text-sm mb-4">{message}</p>}

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="text"
            placeholder="Course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="url"
            placeholder="Note URL (PDF, Google Drive, etc.)"
            value={noteUrl}
            onChange={(e) => setNoteUrl(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Upload Note
          </button>
        </form>
      </div>
    </div>
  );
}
