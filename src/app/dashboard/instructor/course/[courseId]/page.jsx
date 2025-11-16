"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCourseData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load course");

        setCourse(data);
        console.log("data from individual course page", data);
        setVideos(data.videos || []);
        console.log("videos from individual course page", data.videos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading course...</p>;

  if (!course)
    return <p className="text-center text-gray-500 mt-10">Course not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 mb-6">{course.description}</p>

      <h2 className="text-2xl font-semibold mb-3">🎥 Course Videos</h2>

      {videos.length === 0 ? (
        <p className="text-gray-500 mb-4">No videos uploaded yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {videos.map((v) => (
            <div
              key={v.id}
              className="p-4 bg-white border rounded-lg shadow-sm hover:shadow transition"
            >
              <p className="font-medium text-gray-800">{v.title}</p>
              <video
                controls
                src={v.videoUrl}
                className="w-full mt-2 rounded-md"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload new video */}
      <button
        onClick={() =>
          window.location.assign(
            `/dashboard/instructor/upload-video?courseId=${courseId}`
          )
        }
        className="py-2.5 px-6 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium"
      >
        + Upload New Video
      </button>
    </div>
  );
}
