"use client";
import { Card, Progress } from "antd";

export default function CourseCard({ course }) {
  return (
    <Card
      title={course.course_title}
      className="shadow-md border rounded-lg"
      hoverable
    >
      <p className="text-gray-600">{course.description}</p>
      <div className="mt-4">
        <Progress
          percent={course.progress}
          status={course.progress >= 100 ? "success" : "active"}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {course.progress >= 100 ? "✅ Completed" : "📘 In Progress"}
      </p>
    </Card>
  );
}
