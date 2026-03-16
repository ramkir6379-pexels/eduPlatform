"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Video } from "lucide-react";

interface Class {
  id: number;
  name: string;
}

export default function TeacherLiveClassPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/classes/teacher/2");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const startLiveClass = (classId: number) => {
    window.location.href = `/live?classId=${classId}&role=teacher`;
  };

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Start Live Class" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Class to Start Live Session</h2>

          {loading ? (
            <p className="text-gray-600">Loading classes...</p>
          ) : classes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">No classes available. Create a class first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                    <Video className="text-blue-600" size={24} />
                  </div>

                  <p className="text-gray-600 text-sm mb-6">
                    Click below to start a live session for this class
                  </p>

                  <button
                    onClick={() => startLiveClass(cls.id)}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Video size={18} /> Start Live Class
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
