"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ClassListCard from "@/components/classes/ClassListCard";
import CreateClassForm from "@/components/classes/CreateClassForm";
import { Plus } from "lucide-react";
import { API_URL } from "@/config";

interface Class {
  id: number;
  name: string;
  description?: string;
  schedule?: string;
  student_count?: number;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/classes/teacher/2`);
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleCreateClass = async (formData: {
    name: string;
    description: string;
    schedule: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          schedule: formData.schedule,
          teacher_id: 2,
        }),
      });

      if (res.ok) {
        setShowCreateForm(false);
        fetchClasses();
        alert("Class created successfully!");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error creating class");
    } finally {
      setLoading(false);
    }
  };

  const openClass = (classId: number) => {
    window.location.href = `/dashboard/teacher/classes/${classId}`;
  };

  const startLiveClass = (classId: number) => {
    window.location.href = `/live?classId=${classId}&role=teacher`;
  };

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="My Classes" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Create Class Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} /> Create New Class
            </button>
          </div>

          {/* Classes Grid */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Classes</h2>

          {classes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">No classes yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <ClassListCard
                  key={cls.id}
                  id={cls.id}
                  name={cls.name}
                  studentCount={cls.student_count || 0}
                  schedule={cls.schedule}
                  isTeacher={true}
                  onOpen={() => openClass(cls.id)}
                  onStartLive={() => startLiveClass(cls.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Class Modal */}
      {showCreateForm && (
        <CreateClassForm
          onSubmit={handleCreateClass}
          onCancel={() => setShowCreateForm(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
