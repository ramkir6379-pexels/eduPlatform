"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import { TrendingUp, AlertCircle } from "lucide-react";

interface StudentData {
  id: number;
  name: string;
  engagement: number;
  event_count: number;
}

interface StudentRankingProps {
  sessionId: string;
}

export default function StudentRanking({ sessionId }: StudentRankingProps) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/analytics/student-ranking/${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch student data");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [sessionId]);

  if (loading) return <div className="text-gray-600">Loading student data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (students.length === 0) return <div className="text-gray-600">No student data available</div>;

  const topStudents = students.slice(0, Math.ceil(students.length / 2));
  const atRiskStudents = students.slice(-Math.floor(students.length / 2));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Students */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-green-600" />
          <h3 className="text-lg font-bold text-gray-800">Top Students</h3>
        </div>
        <div className="space-y-3">
          {topStudents.map((student, index) => (
            <div key={student.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">
                  #{index + 1} {student.name}
                </p>
                <p className="text-sm text-gray-600">{student.event_count} interactions</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {(student.engagement * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At Risk Students */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={20} className="text-red-600" />
          <h3 className="text-lg font-bold text-gray-800">At Risk Students</h3>
        </div>
        <div className="space-y-3">
          {atRiskStudents.length > 0 ? (
            atRiskStudents.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">
                    ⚠️ {student.name}
                  </p>
                  <p className="text-sm text-gray-600">{student.event_count} interactions</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {(student.engagement * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-4">No at-risk students</p>
          )}
        </div>
      </div>
    </div>
  );
}
