"use client";

import { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Table, Tag, message, Tabs, Skeleton } from "antd";
import { UserOutlined, BookOutlined, DollarOutlined } from "@ant-design/icons";
import Navbar from "@/components/Navbar";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalRevenue: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Not authorized");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const loadData = async () => {
      try {
        const [usersRes, coursesRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, { headers }),
          fetch(`${API_BASE}/admin/courses`, { headers }),
          fetch(`${API_BASE}/admin/stats`, { headers }),
        ]);

        const [usersData, coursesData, statsData] = await Promise.all([
          usersRes.json(),
          coursesRes.json(),
          statsRes.json(),
        ]);

        setUsers(usersData);
        setCourses(coursesData);
        setStats(statsData);
      } catch (err) {
        console.error(err);
        message.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active />
      </div>
    );
  }

  const userColumns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const color =
          role === "admin" ? "volcano" : role === "instructor" ? "geekblue" : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
  ];

  const courseColumns = [
    {
      title: "Course Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (text ? text.slice(0, 70) + "..." : "-"),
    },
    {
      title: "Instructor Email",
      dataIndex: "instructor_email",
      key: "instructor_email",
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (d) => new Date(d).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">🧑‍💼 Admin Dashboard</h1>

      {/* ===== Statistics Section ===== */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Revenue (₹)"
              value={stats.totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== Tabs for Users & Courses ===== */}
      <Tabs
        defaultActiveKey="users"
        items={[
          {
            key: "users",
            label: "Users",
            children: (
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 8 }}
              />
            ),
          },
          {
            key: "courses",
            label: "Courses",
            children: (
              <Table
                columns={courseColumns}
                dataSource={courses}
                rowKey="id"
                pagination={{ pageSize: 8 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
