"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Trash2, Eye } from "lucide-react";

interface Class {
  id: number;
  name: string;
  teacher_id: number;
  teacher?: string;
  student_count?: number;
  created_at: string;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (classId: number) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="admin" />

      <div className="ml-64 w-full">
        <Topbar title="Class Management" userName="Admin" role="admin" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Classes</h2>

          {loading ? (
            <p className="text-gray-600">Loading classes...</p>
          ) : classes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">No classes yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Class Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Teacher</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Students</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800 font-medium">{cls.name}</td>
                      <td className="px-6 py-4 text-gray-600">{cls.teacher || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-600">{cls.student_count || 0}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(cls.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => deleteClass(cls.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
