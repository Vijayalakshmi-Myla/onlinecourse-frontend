"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import QuizResults from "@/components/QuizResults";
import { Button, Card, Tabs, message, Skeleton } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState([]);


  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // Check for payment success query params
  useEffect(() => {
    const paid = searchParams.get("paid");
    const courseId = searchParams.get("courseId");

    if (paid && courseId) {
      message.success("Payment successful! Course unlocked.");
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, resultsRes, allCoursesRes, paymentsRes] =
          await Promise.all([
            fetchWithAuth(`${API_BASE}/api/student`),
            fetchWithAuth(`${API_BASE}/api/student/getQuizResults`),
            fetchWithAuth(`${API_BASE}/api/courses`),
            fetchWithAuth(`${API_BASE}/api/payments/my-payments`),
          ]);

          setPayments(paymentsRes.payments || []);
          
        // Normalize enrolled courses
        const normalizedMyCourses = (coursesRes || []).map((c) => ({
          id: c.course_id,
          title: c.course_title,
          description: c.description,
          progress: c.progress,
        }));

        setMyCourses(normalizedMyCourses);

        // Quiz results
        setQuizResults(
          Array.isArray(resultsRes) ? resultsRes : resultsRes.results || []
        );

        // Filter out courses the user already has
        const enrolledIds = normalizedMyCourses.map((c) => c.id);
        const newCourses =
          (allCoursesRes || []).filter(
            (course) => !enrolledIds.includes(course.id)
          ) || [];

        setAvailableCourses(newCourses);

        // Optionally inspect payment history
        console.log("My Payments:", paymentsRes?.payments);
      } catch (err) {
        console.error(err);
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API_BASE]);

  // Handle Enrollment → Stripe Checkout
  const handleEnroll = async (courseId) => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/payments/checkout`, {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });

      if (res.url) {
        window.location.href = res.url;
      } else if (res.courseId) {
        // If payment already exists, unlock immediately
        router.push(`/courses/${res.courseId}`);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to start payment process");
    }
  };

  if (loading) return <Skeleton active className="p-6" />;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">🎓 Student Dashboard</h1>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "My Courses",
            children: (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCourses.length > 0 ? (
                  myCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <p>No enrolled courses yet.</p>
                )}
              </div>
            ),
          },
          {
            key: "2",
            label: "Available Courses",
            children: (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCourses.length > 0 ? (
                  availableCourses.map((course) => (
                    <Card
                      key={course.id}
                      title={course.title}
                      className="shadow-md border rounded-lg"
                    >
                      <p>{course.description}</p>
                      <p className="mt-2 font-semibold text-green-600">
                        {course.price}$
                      </p>
                      <Button
                        type="primary"
                        className="mt-3"
                        onClick={() => handleEnroll(course.id)}
                      >
                        Enroll Now
                      </Button>
                    </Card>
                  ))
                ) : (
                  <p>No available courses at the moment.</p>
                )}
              </div>
            ),
          },
          {
            key: "3",
            label: "Quiz Results",
            children:
              quizResults.length > 0 ? (
                <QuizResults results={quizResults} />
              ) : (
                <p>No quiz results yet.</p>
              ),
          },
          {
            key: "4",
            label: "My Payments",
            children: (
              <div className="max-w-2xl">
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <Card key={p.id} className="mb-3 shadow">
                      <p>
                        <strong>Course:</strong> {p.course?.title}
                      </p>
                      <p>
                        <strong>Amount:</strong> ${p.amount}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(p.created_at).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {p.status}
                      </p>
                    </Card>
                  ))
                ) : (
                  <p>No payments yet.</p>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
