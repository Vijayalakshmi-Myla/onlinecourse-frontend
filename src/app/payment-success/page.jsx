"use client";

"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "edge";


import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Result, Button } from "antd";



export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (courseId) {
      const timer = setTimeout(() => {
        router.push(`/courses/${courseId}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [courseId]);

  return (
    <div className="p-6 flex justify-center">
      <Result
        status="success"
        title="Payment Successful!"
        subTitle="Your course is now unlocked."
        extra={[
          <Button
            type="primary"
            key="course"
            onClick={() => router.push(`/courses/${courseId}`)}
          >
            Go to Course
          </Button>,
          <Button key="dashboard" onClick={() => router.push("/dashboard/student")}>
            Back to Dashboard
          </Button>,
        ]}
      />
    </div>
  );
}

