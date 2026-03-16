"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { BookOpen, Users, ClipboardCheck, BarChart3, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const quizData = [
  { quiz: "Quiz 1", avg: 72 },
  { quiz: "Quiz 2", avg: 81 },
  { quiz: "Quiz 3", avg: 65 },
];

const activities = [
  { student: "Ravi", action: "Submitted Quiz", time: "5 min ago" },
  { student: "Divya", action: "Marked Attendance", time: "15 min ago" },
  { student: "Karthik", action: "Joined Class", time: "1 hour ago" },
  { student: "Priya", action: "Submitted Assignment", time: "2 hours ago" },
];

export default function TeacherDashboard() {
  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Teacher Dashboard" userName="Ramki" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">👨‍🏫 Teacher Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your teaching overview.</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 flex gap-4 flex-wrap">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus size={20} /> Create Class
            </button>
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              <Plus size={20} /> Start Live Class
            </button>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              <Plus size={20} /> Create Quiz
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="📚 My Classes"
              value="3"
              icon={<BookOpen size={32} />}
              color="#3b82f6"
            />
            <StatCard
              title="👨‍🎓 Total Students"
              value="45"
              icon={<Users size={32} />}
              color="#10b981"
            />
            <StatCard
              title="✅ Attendance Today"
              value="42/45"
              icon={<ClipboardCheck size={32} />}
              color="#f59e0b"
            />
            <StatCard
              title="📝 Quizzes Created"
              value="8"
              icon={<BarChart3 size={32} />}
              color="#8b5cf6"
            />
          </div>

          {/* Chart */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <ChartCard title="Quiz Average Scores">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Activity */}
          <ChartCard title="Recent Activity">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-600 font-semibold">Student</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Action</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, i) => (
                  <tr key={i} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3 font-medium">{activity.student}</td>
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
