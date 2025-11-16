"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /** Step 1: Create course */
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/create-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, price }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create course");

      setCourseId(data.course.id);
      setMessage("✅ Course created! Now upload videos.");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /** Step 2: Upload video */
  const handleUploadVideo = async () => {
    if (!videoFile || !courseId) return setMessage("Select a video first!");
    setLoading(true);

    try {
      const filePath = `${courseId}/${videoFile.name}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, videoFile, { upsert: true });
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData, error: urlError } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      const publicUrl = urlData.publicUrl;

      // Call backend to save video record
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/${courseId}/upload-video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: courseId,
            title: videoFile.name,
            video_url: publicUrl,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save video record");

      setMessage("✅ Video uploaded successfully!");
      setVideoFile(null);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Create a New Course</h1>

      {message && (
        <div
          className={`p-2 mb-4 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {!courseId && (
        <form onSubmit={handleCreateCourse} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded"
            rows={4}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      )}

      {courseId && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Upload Video for Course</h2>

          <div>
            <label className="block mb-1">Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
            <button
              onClick={handleUploadVideo}
              disabled={loading || !videoFile}
              className="ml-2 px-3 py-1 bg-purple-600 text-white rounded"
            >
              Upload Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
