"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { BookOpen, ClipboardCheck, BarChart3, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const attendanceData = [
  { week: "Week 1", attendance: 85 },
  { week: "Week 2", attendance: 90 },
  { week: "Week 3", attendance: 88 },
  { week: "Week 4", attendance: 92 },
];

const quizScores = [
  { quiz: "Quiz 1", score: 72 },
  { quiz: "Quiz 2", score: 81 },
  { quiz: "Quiz 3", score: 65 },
];

const assignments = [
  { title: "Math Assignment", due: "2 days", status: "Pending" },
  { title: "Science Quiz", due: "5 days", status: "Pending" },
  { title: "English Essay", due: "1 day", status: "Submitted" },
  { title: "History Project", due: "3 days", status: "Submitted" },
];

export default function StudentDashboard() {
  return (
    <div className="flex">
      <Sidebar role="student" />

      <div className="ml-64 w-full">
        <Topbar title="Student Dashboard" userName="Ramki" role="student" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">👨‍🎓 Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your progress and manage your learning.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="📚 My Classes"
              value="4"
              icon={<BookOpen size={32} />}
              color="#3b82f6"
            />
            <StatCard
              title="✅ Attendance %"
              value="88%"
              icon={<ClipboardCheck size={32} />}
              color="#10b981"
            />
            <StatCard
              title="📊 Quiz Score"
              value="73%"
              icon={<BarChart3 size={32} />}
              color="#f59e0b"
            />
            <StatCard
              title="📝 Assignments"
              value="3"
              icon={<TrendingUp size={32} />}
              color="#8b5cf6"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Attendance Trend">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Quiz Scores">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Assignments */}
          <ChartCard title="Assignments">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-600 font-semibold">Title</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Due</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, i) => (
                  <tr key={i} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3 font-medium">{assignment.title}</td>
                    <td className="p-3">{assignment.due}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          assignment.status === "Submitted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>
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
