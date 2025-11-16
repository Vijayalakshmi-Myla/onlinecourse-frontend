"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  const courses = [
  {
    title: "Artificial Intelligence / Machine Learning",
    slug: "ai-ml", // ✅ slug must exist
    desc: "Learn the fundamentals of AI and ML, from neural networks to deep learning applications.",
  },
  {
    title: "Data Science",
    slug: "data-science",
    desc: "Master data analysis, visualization, and statistical modeling with Python and R.",
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    desc: "Understand ethical hacking, network defense, and risk management strategies.",
  },
  {
    title: "Web Development",
    slug: "web-development",
    desc: "Build modern web applications using HTML, CSS, JavaScript, and frameworks like React.",
  },
];

  return (
    <div className="min-h-screen bg-gray-700 text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-700 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">E-learn</h1>
        <div className="space-x-6">
          <a href="#" className="hover:text-gray-200 transition">
            About Us
          </a>
          <a href="/login" className="hover:text-gray-200 transition">
            Login
          </a>
        </div>
      </nav>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-extrabold font-sans mb-4 text-gray-200">
          Welcome to E-learn
        </h1>
        <p className="text-xl font-semibold mb-2 text-gray-300">
          Immerse yourself in a world of knowledge and skill-building. 
        </p>
        <p className="text-xl font-semibold mb-12 text-gray-300">  
          Do you want to learn something new today?
        </p>
        <h2 className="text-3xl font-semibold mb-8 text-gray-200">
          Explore Our Courses
        </h2>

        <div className="w-full overflow-hidden">
          <div className="flex space-x-8 animate-scroll">
            {courses.map((course, index) => (
              <Link
                href={`/courses/${course.slug}`}
                key={index}
                className="w-[320px] h-[220px] bg-white rounded-xl shadow-md hover:shadow-2xl p-6 shrink-0 border border-gray-200 transition-transform duration-300 hover:-translate-y-2"
              >
                <h3 className="text-lg font-bold mb-3 text-blue-600">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {course.desc}
                </p>
              </Link>
            ))}

            {/* Duplicate cards for infinite scroll effect */}
            {courses.map((course, index) => (
              <Link
                href={`/courses/${course.slug}`}
                key={index}
                className="w-[320px] h-[220px] bg-white rounded-xl shadow-md hover:shadow-2xl p-6 shrink-0 border border-gray-200 transition-transform duration-300 hover:-translate-y-2"
              >
                <h3 className="text-lg font-bold mb-3 text-blue-600">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {course.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          display: flex;
          width: calc(320px * 8 + 7rem);
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
