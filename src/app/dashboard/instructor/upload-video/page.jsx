"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadVideoPage() {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setMessage("❌ Please select a video file!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Upload video to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(`course_videos/${videoFile.name}`, videoFile, { upsert: true });

      if (uploadError) throw uploadError;

      // 2️⃣ Get public URL
      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(`course_videos/${videoFile.name}`);

      const video_url = urlData.publicUrl;

      // 3️⃣ Send metadata to backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/${courseId}/upload-video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ course_id: courseId, title, video_url, duration }),
        }
      );

      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Upload failed");

      setMessage("✅ Video uploaded successfully!");
      setCourseId("");
      setTitle("");
      setVideoFile(null);
      setDuration("");
      e.target.reset();

    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-lg mx-auto bg-white p-8 shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Video</h1>

        {message && (
          <p className={`text-center text-sm mb-4 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

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
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g., 10:30)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
