"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Video } from "lucide-react";

interface Class {
  id: number;
  name: string;
  teacher: string;
}

export default function StudentLiveClassPage() {
  const [enrolledClasses, setEnrolledClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  const fetchEnrolledClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/student/3`);
      const data = await res.json();
      setEnrolledClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinLiveClass = (classId: number) => {
    window.location.href = `/live?classId=${classId}&role=student`;
  };

  return (
    <div className="flex">
      <Sidebar role="student" />

      <div className="ml-64 w-full">
        <Topbar title="Join Live Class" userName="Student" role="student" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Live Classes</h2>

          {loading ? (
            <p className="text-gray-600">Loading classes...</p>
          ) : enrolledClasses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">You haven't joined any classes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                    <Video className="text-green-600" size={24} />
                  </div>

                  <p className="text-gray-600 text-sm mb-6">Teacher: {cls.teacher || "Unknown"}</p>

                  <button
                    onClick={() => joinLiveClass(cls.id)}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Video size={18} /> Join Live Class
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
