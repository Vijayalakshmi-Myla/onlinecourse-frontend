"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch courses");
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading courses...</p>;

  return (
    <div className="w-full mx-auto px-6 py-10 bg-blue-300">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-500">You haven’t created any courses yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 bg-white rounded-lg shadow border hover:border-blue-400 transition"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
              <p className="text-sm text-gray-400 mt-2">course ID: {course.id}</p>
              <p className="text-sm text-gray-400 mt-2">
                Created on: {new Date(course.created_at).toLocaleDateString()}
              </p>
              <button
                onClick={() => router.push(`/dashboard/instructor/course/${course.id}`)}
                className="w-md py-3 mt-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium"
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
