"use client";
import { Table, Tag } from "antd";

export default function QuizResults({ results }) {
  const columns = [
    {
      title: "Course ID",
      dataIndex: "course_id",
      key: "course_id",
    },
    {
      title: "Quiz ID",
      dataIndex: "quiz_id",
      key: "quiz_id",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score, record) => `${score}/${record.total}`,
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      render: (p) => `${p}%`,
    },
    {
      title: "Status",
      dataIndex: "passed",
      key: "passed",
      render: (passed) =>
        passed ? (
          <Tag color="green">Passed</Tag>
        ) : (
          <Tag color="red">Failed</Tag>
        ),
    },
    
  ];

  return (
    <Table
      columns={columns}
      dataSource={results}
      rowKey={(r) => `${r.quiz_id}-${r.course_id}`}
      pagination={{ pageSize: 5 }}
    />
  );
}
