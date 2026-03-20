"use client";

import { API_URL } from "@/config";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { BookOpen, Users, ClipboardCheck, BarChart3, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const activities = [
  { student: "Ravi", action: "Submitted Quiz", time: "5 min ago" },
  { student: "Divya", action: "Marked Attendance", time: "15 min ago" },
  { student: "Karthik", action: "Joined Class", time: "1 hour ago" },
  { student: "Priya", action: "Submitted Assignment", time: "2 hours ago" },
];

// Format time consistently
const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function TeacherDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [isLive, setIsLive] = useState(false);

  // Fetch available sessions
  useEffect(() => {
    console.log("FETCHING SESSIONS...");

    fetch(`${API_URL}/api/analytics/sessions`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SESSIONS:", data);
        setSessions(data);

        // Auto-select latest session
        if (data.length > 0) {
          setSessionId(data[0].session_id);
        }
      })
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  // Initial fetch when session changes
  useEffect(() => {
    if (!sessionId) return;

    console.log("FETCH CALLED with:", sessionId);
    setLoading(true);
    setTimeline([]);
    setIsLive(false);

    fetch(`${API_URL}/api/analytics/timeline/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("FETCH DATA:", data);

        const formatted = data.map((d: any) => ({
          time: d.time,
          engagement: Number(d.engagement),
        }));

        console.log("FORMATTED:", formatted);
        setTimeline(formatted);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
        setLoading(false);
      });
  }, [sessionId]);

  // Socket listener for live updates
  useEffect(() => {
    if (!sessionId) return;

    console.log("SOCKET LISTENER STARTED for:", sessionId);

    const socket = io(API_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("engagement_update", (data: any) => {
      console.log("ENGAGEMENT UPDATE:", data);

      if (data.session_id !== sessionId) {
        console.log("SESSION MISMATCH - ignoring");
        return;
      }

      setIsLive(true);

      const formattedTime = formatTime(data.created_at);

      setTimeline((prev: any[]) => {
        const exists = prev.find((p) => p.time === formattedTime);
        if (exists) {
          console.log("DUPLICATE - skipping");
          return prev;
        }

        console.log("ADDING NEW POINT:", formattedTime, data.engagement_score);

        return [
          ...prev,
          {
            time: formattedTime,
            engagement: Number(data.engagement_score),
          },
        ];
      });
    });

    return () => {
      console.log("SOCKET DISCONNECTED");
      socket.disconnect();
    };
  }, [sessionId]);

  // Polling fallback (only when NOT live)
  useEffect(() => {
    if (!sessionId || isLive) {
      console.log("POLLING SKIPPED - isLive:", isLive);
      return;
    }

    console.log("POLLING STARTED");

    const interval = setInterval(() => {
      console.log("POLLING FETCH...");

      fetch(`${API_URL}/api/analytics/timeline/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((d: any) => ({
            time: d.time,
            engagement: Number(d.engagement),
          }));
          setTimeline(formatted);
        })
        .catch((error) => console.error("Polling error:", error));
    }, 10000);

    return () => {
      console.log("POLLING STOPPED");
      clearInterval(interval);
    };
  }, [sessionId, isLive]);

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSessionId(e.target.value);
    setIsLive(false);
    setTimeline([]);
  };

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

          {/* Session Selector */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Session
            </label>
            <div className="flex gap-4 items-center">
              <select
                value={sessionId}
                onChange={handleSessionChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a session --</option>
                {sessions.map((s) => (
                  <option key={s.session_id} value={s.session_id}>
                    {s.session_id}
                  </option>
                ))}
              </select>
              {isLive && (
                <span className="px-3 py-2 bg-red-100 text-red-800 rounded-lg font-semibold text-sm">
                  🔴 LIVE
                </span>
              )}
            </div>
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
            <ChartCard title="Live Engagement Timeline">
              {loading ? (
                <div className="flex items-center justify-center h-300 text-gray-500">
                  Loading engagement data...
                </div>
              ) : !sessionId ? (
                <div className="flex items-center justify-center h-300 text-gray-500">
                  Select a session to view data
                </div>
              ) : timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Engagement Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-300 text-gray-500">
                  No engagement data available for this session
                </div>
              )}
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
