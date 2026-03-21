"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface ClassData {
  id: number;
  name: string;
  engagement: number;
  student_count: number;
  total_events: number;
}

const getStatus = (engagement: number | null) => {
  const eng = engagement || 0;
  if (eng > 0.7) {
    return { label: "Excellent", color: "bg-green-100 text-green-800", icon: "🟢" };
  }
  if (eng > 0.4) {
    return { label: "Average", color: "bg-yellow-100 text-yellow-800", icon: "🟡" };
  }
  return { label: "At Risk", color: "bg-red-100 text-red-800", icon: "🔴" };
};

export default function ClassOverview() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/analytics/admin/classes`);
        if (!res.ok) throw new Error("Failed to fetch class data");
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  if (loading) return <div className="text-gray-600">Loading class data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (classes.length === 0) return <div className="text-gray-600">No classes available</div>;

  return (
    <div className="space-y-4">
      {classes.map((classItem) => {
        const status = getStatus(classItem.engagement);
        const engagementPercent = Math.round((classItem.engagement || 0) * 100);

        return (
          <div
            key={classItem.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{classItem.name}</h3>
                <p className="text-sm text-gray-600">
                  {classItem.student_count} students • {classItem.total_events} interactions
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                {status.icon} {status.label}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Engagement Level</span>
                <span className="text-2xl font-bold text-gray-800">{engagementPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    engagementPercent > 70
                      ? "bg-green-500"
                      : engagementPercent > 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(engagementPercent, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Students Tracked</p>
                <p className="text-xl font-bold text-gray-800">{classItem.student_count}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Total Events</p>
                <p className="text-xl font-bold text-gray-800">{classItem.total_events}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Avg Engagement</p>
                <p className="text-xl font-bold text-gray-800">
                  {((classItem.engagement || 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
