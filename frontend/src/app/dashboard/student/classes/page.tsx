"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ClassListCard from "@/components/classes/ClassListCard";
import { Plus } from "lucide-react";
import { API_URL } from "@/config";

interface Class {
  id: number;
  name: string;
  teacher: string;
  student_count?: number;
}

export default function StudentClassesPage() {
  const [enrolledClasses, setEnrolledClasses] = useState<Class[]>([]);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  const fetchEnrolledClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/classes/student/3`);
      const data = await res.json();
      setEnrolledClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const joinClass = async () => {
    if (!classId.trim()) {
      alert("Please enter a class ID");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/classes/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: parseInt(classId),
          student_id: 3,
        }),
      });

      if (res.ok) {
        setClassId("");
        setShowJoinForm(false);
        fetchEnrolledClasses();
        alert("Successfully joined class!");
      } else {
        alert("Failed to join class");
      }
    } catch (error) {
      console.error("Error joining class:", error);
      alert("Error joining class");
    } finally {
      setLoading(false);
    }
  };

  const openClass = (classId: number) => {
    window.location.href = `/dashboard/student/classes/${classId}`;
  };

  const joinLiveClass = (classId: number) => {
    window.location.href = `/live?classId=${classId}&role=student`;
  };

  return (
    <div className="flex">
      <Sidebar role="student" />

      <div className="ml-64 w-full">
        <Topbar title="My Classes" userName="Student" role="student" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Join Class Section */}
          <div className="mb-8">
            {!showJoinForm ? (
              <button
                onClick={() => setShowJoinForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus size={20} /> Join a Class
              </button>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
                <h3 className="text-lg font-bold mb-4">Join a Class</h3>
                <input
                  type="number"
                  placeholder="Enter Class ID"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={joinClass}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? "Joining..." : "Join"}
                  </button>
                  <button
                    onClick={() => setShowJoinForm(false)}
                    className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enrolled Classes */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Enrolled Classes</h2>

          {enrolledClasses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">You haven't joined any classes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map((cls) => (
                <ClassListCard
                  key={cls.id}
                  id={cls.id}
                  name={cls.name}
                  teacher={cls.teacher}
                  studentCount={cls.student_count || 0}
                  onOpen={() => openClass(cls.id)}
                  onJoinLive={() => joinLiveClass(cls.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
