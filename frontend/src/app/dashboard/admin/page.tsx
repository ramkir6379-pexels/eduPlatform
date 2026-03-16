"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { Users, BookOpen, BarChart3, ClipboardCheck, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const attendanceData = [
  { day: "Mon", attendance: 85 },
  { day: "Tue", attendance: 90 },
  { day: "Wed", attendance: 88 },
  { day: "Thu", attendance: 92 },
  { day: "Fri", attendance: 86 },
];

const quizData = [
  { quiz: "Quiz 1", score: 72 },
  { quiz: "Quiz 2", score: 81 },
  { quiz: "Quiz 3", score: 65 },
];

const activities = [
  { name: "Ravi", action: "Joined Class A", time: "2 min ago" },
  { name: "Divya", action: "Submitted Quiz 2", time: "10 min ago" },
  { name: "Karthik", action: "Marked Attendance", time: "30 min ago" },
  { name: "Priya", action: "Started Live Class", time: "1 hour ago" },
];

interface AdminStats {
  students: number;
  teachers: number;
  classes: number;
  quizzes: number;
  avgScore: number;
  attendanceRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <div className="ml-64 w-full">
          <Topbar title="Admin Dashboard" userName="Admin" role="admin" />
          <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="admin" />

      <div className="ml-64 w-full">
        <Topbar title="Admin Dashboard" userName="Admin" role="admin" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Quick Actions */}
          <div className="mb-8 flex gap-4">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus size={20} /> Add Teacher
            </button>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              <Plus size={20} /> Add Student
            </button>
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              <Plus size={20} /> Create Class
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="👨‍🎓 Total Students"
              value={stats?.students.toString() || "0"}
              icon={<Users size={32} />}
              color="#3b82f6"
            />
            <StatCard
              title="👨‍🏫 Total Teachers"
              value={stats?.teachers.toString() || "0"}
              icon={<Users size={32} />}
              color="#10b981"
            />
            <StatCard
              title="📚 Active Classes"
              value={stats?.classes.toString() || "0"}
              icon={<BookOpen size={32} />}
              color="#f59e0b"
            />
          </div>

          {/* Second Row Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="📝 Total Quizzes"
              value={stats?.quizzes.toString() || "0"}
              icon={<BarChart3 size={32} />}
              color="#8b5cf6"
            />
            <StatCard
              title="📊 Average Quiz Score"
              value={`${Math.round(stats?.avgScore || 0)}%`}
              icon={<BarChart3 size={32} />}
              color="#ec4899"
            />
            <StatCard
              title="✅ Attendance Rate"
              value={`${Math.round(stats?.attendanceRate || 0)}%`}
              icon={<ClipboardCheck size={32} />}
              color="#06b6d4"
            />
          </div>

          {/* Charts - 2 Column Layout */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <ChartCard title="Attendance Trend">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Quiz Performance">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Activity Table */}
          <ChartCard title="Recent Activity">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-600 font-semibold">Name</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Action</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, i) => (
                  <tr key={i} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3 font-medium">{activity.name}</td>
                    <td className="p-3">{activity.action}</td>
                    <td className="p-3 text-gray-500 text-sm">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
