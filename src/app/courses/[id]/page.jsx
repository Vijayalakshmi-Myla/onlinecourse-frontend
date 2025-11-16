"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { Card, Skeleton, message, Collapse, Button, Typography, Space } from "antd";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Navbar from "@/components/Navbar";

const { Title, Paragraph } = Typography;

export default function CoursePage() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/api/courses/${courseId}`);

        if (!res || res.error) {
          message.error("You do not have access to this course.");
          return router.push("/dashboard/student");
        }

        setCourse(res.course);
        setLessons(res.lessons || []);
      } catch (err) {
        console.error(err);
        message.error("Failed to load course.");
        router.push("/dashboard/student");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  if (loading) return <Skeleton active className="p-6" />;

  return (
  <div className="p-6 max-w-5xl mx-auto bg-[#fdf6e3] min-h-screen">
    <Navbar />
    {/* Course Header */}
    <Title level={2} className="text-[#3e3e3e]">{course?.title}</Title>
    <Paragraph className="text-[#555555]">{course?.description}</Paragraph>

    {/* Lessons */}
    <Title level={4} className="mt-6 mb-3 text-[#3e3e3e]">📘 Lessons</Title>
    {lessons.length === 0 && <Paragraph>No lessons available for this course.</Paragraph>}

    <Collapse
      accordion
      className="bg-[#fff8f0] shadow-lg rounded-lg border border-[#e5e5e5]"
      items={lessons.map((lesson) => ({
        key: lesson.id,
        label: (
          <div className="flex items-center justify-between w-full">
            <Space>
              <PlayCircleOutlined className="text-[#ff7f50] text-lg" />
              <span className="font-semibold text-[#333333]">{lesson.title}</span>
            </Space>
            {lesson.duration && (
              <Space>
                <ClockCircleOutlined className="text-gray-500" />
                <span className="text-gray-600">{lesson.duration}</span>
              </Space>
            )}
          </div>
        ),
        children: (
          <div className="space-y-4 mt-2">
            {lesson.video_url && (
              <video controls className="w-full rounded-md shadow-md border border-[#e0e0e0]" style={{ maxHeight: "450px" }}>
                <source src={lesson.video_url} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            )}
            {lesson.content && (
              <Card className="bg-[#fffefc] border border-[#e5e5e5] rounded-md shadow-sm">
                <Paragraph className="text-gray-700">
                  <FileTextOutlined className="mr-2 text-gray-600" />
                  {lesson.content}
                </Paragraph>
              </Card>
            )}
            {lesson.quiz_id && (
              <Button
                type="primary"
                className="bg-[#ff7f50] border-[#ff7f50] hover:bg-[#ff6333]"
                icon={<QuestionCircleOutlined />}
                onClick={() => router.push(`/quiz/${lesson.quiz_id}`)}
              >
                Start Quiz
              </Button>
            )}
          </div>
        ),
      }))}
    />
  </div>
  );
}
