"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function InstructorDashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-linear-to-br from-white to-gray-400 py-12 px-6">
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            👩‍🏫 Hallo Instructor
          </h1>
          <p className="text-gray-600">
            Manage your courses, videos, and content — all in one place.
          </p>
        </div>

        {/* Dashboard cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create Course */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              🎓 Create a New Course
            </h2>
            <p className="text-gray-600 mb-6">
              Start by creating a course and adding details like title, description, and price.
            </p>
            <button
              onClick={() => router.push("/dashboard/instructor/create-course")}
              className="w-full py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium"
            >
              Create Course
            </button>
          </div>

          {/* View Courses */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">📚 My Courses</h2>
            <p className="text-gray-600 mb-6">
              View, edit, and manage all the courses you’ve created.
            </p>
            <button
              onClick={() => router.push("/dashboard/instructor/my-courses")}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition font-medium"
            >
              View Courses
            </button>
          </div>

          
        </div>
      </div>
    </main>
  );
}
