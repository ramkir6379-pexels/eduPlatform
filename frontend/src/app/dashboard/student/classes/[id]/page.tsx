"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { ArrowLeft, Play, Eye, BookOpen } from "lucide-react";
import Link from "next/link";

interface Student {
  id: number;
  name: string;
  email: string;
}

interface ClassData {
  id: number;
  name: string;
  description?: string;
  teacher?: string;
}

export default function StudentClassDetailPage() {
  const params = useParams();
  const classId = params.id;
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}`);
      const data = await res.json();
      setClassData(data);

      // Fetch students in this class
      const studentsRes = await fetch(`http://localhost:5000/api/classes/${classId}/students`);
      const studentsData = await studentsRes.json();
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinLiveClass = () => {
    window.location.href = `/live?classId=${classId}`;
  };

  const viewAttendance = () => {
    window.location.href = `/dashboard/student/attendance`;
  };

  const viewQuizzes = () => {
    window.location.href = `/dashboard/student/quizzes`;
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="student" />
        <div className="ml-64 w-full">
          <Topbar title="Class Details" userName="Student" role="student" />
          <div className="p-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="student" />

      <div className="ml-64 w-full">
        <Topbar title="Class Details" userName="Student" role="student" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Back Button */}
          <Link
            href="/dashboard/student/classes"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} /> Back to Classes
          </Link>

          {/* Class Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{classData?.name}</h1>
            {classData?.teacher && (
              <p className="text-gray-600">Teacher: {classData.teacher}</p>
            )}
            {classData?.description && (
              <p className="text-gray-600 mt-2">{classData.description}</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={joinLiveClass}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Play size={20} /> Join Live Class
            </button>
            <button
              onClick={viewAttendance}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Eye size={20} /> View Attendance
            </button>
            <button
              onClick={viewQuizzes}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              <BookOpen size={20} /> View Quizzes
            </button>
          </div>

          {/* Students List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Class Members ({students.length})</h2>
            </div>

            {students.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">No students in this class.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800 font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-gray-600">{student.email}</td>
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
