"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import EmotionDistribution from "@/components/EmotionDistribution";
import QuizPerformance from "@/components/QuizPerformance";
import CombinedAnalytics from "@/components/CombinedAnalytics";
import { ArrowLeft, Play, ClipboardCheck, BookOpen } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/config";

interface Student {
  id: number;
  name: string;
  email: string;
}

interface ClassData {
  id: number;
  name: string;
  description?: string;
  schedule?: string;
}

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id;
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/classes/${classId}`);
      const data = await res.json();
      setClassData(data);

      // Fetch students in this class
      const studentsRes = await fetch(`${API_URL}/api/classes/${classId}/students`);
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      // Fetch latest session for this class
      const sessionsRes = await fetch(`${API_URL}/api/analytics/sessions`);
      const sessionsData = await sessionsRes.json();
      const classSession = sessionsData.find((s: any) => s.session_id?.includes(classId));
      if (classSession) {
        setSessionId(classSession.session_id);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startLiveClass = () => {
    window.location.href = `/live?classId=${classId}`;
  };

  const takeAttendance = () => {
    window.location.href = `/dashboard/teacher/attendance?classId=${classId}`;
  };

  const createQuiz = () => {
    window.location.href = `/dashboard/teacher/quizzes/create?classId=${classId}`;
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="teacher" />
        <div className="ml-64 w-full">
          <Topbar title="Class Details" userName="Teacher" role="teacher" />
          <div className="p-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Class Details" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Back Button */}
          <Link
            href="/dashboard/teacher/classes"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} /> Back to Classes
          </Link>

          {/* Class Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{classData?.name}</h1>
            {classData?.description && (
              <p className="text-gray-600 mb-2">{classData.description}</p>
            )}
            {classData?.schedule && (
              <p className="text-gray-600">Schedule: {classData.schedule}</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={startLiveClass}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Play size={20} /> Start Live Class
            </button>
            <button
              onClick={takeAttendance}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <ClipboardCheck size={20} /> Take Attendance
            </button>
            <button
              onClick={createQuiz}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              <BookOpen size={20} /> Create Quiz
            </button>
          </div>

          {/* Emotion Distribution */}
          {sessionId && (
            <div className="mb-8">
              <EmotionDistribution sessionId={sessionId} />
            </div>
          )}

          {/* Quiz Performance */}
          <div className="mb-8">
            <QuizPerformance classId={String(classId)} />
          </div>

          {/* Combined Analytics */}
          {sessionId && (
            <div className="mb-8">
              <CombinedAnalytics classId={String(classId)} sessionId={sessionId} />
            </div>
          )}

          {/* Students List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Enrolled Students ({students.length})</h2>
            </div>

            {students.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">No students enrolled yet.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800 font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-gray-600">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
