"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Check, X, Download } from "lucide-react";
import { API_URL } from "@/config";

interface Student {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleClassSelect = async (classId: number) => {
    setSelectedClass(classId);
    setAttendance({});
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/classes/${classId}/students`);
      const data = await res.json();
      setStudents(data);

      // Initialize attendance with all present by default
      const initialAttendance: { [key: number]: string } = {};
      data.forEach((student: Student) => {
        initialAttendance[student.id] = "present";
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId: number) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const submitAttendance = async () => {
    if (!selectedClass) return;

    setSubmitting(true);
    try {
      const records = students.map((student) => ({
        student_id: student.id,
        status: attendance[student.id] || "present",
      }));

      const res = await fetch(`${API_URL}/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: selectedClass,
          date: new Date().toISOString().split("T")[0],
          records,
        }),
      });

      if (res.ok) {
        alert("Attendance saved successfully!");
        setSelectedClass(null);
        setStudents([]);
        setAttendance({});
      } else {
        alert("Failed to save attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error saving attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const exportAttendance = async () => {
    if (!selectedClass) return;

    try {
      const res = await fetch(`${API_URL}/api/attendance/export/${selectedClass}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting attendance:", error);
      alert("Error exporting attendance");
    }
  };

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Attendance Management" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Class Selection Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Select Class</h2>

                {classes.length === 0 ? (
                  <p className="text-gray-600 text-sm">No classes available.</p>
                ) : (
                  <div className="space-y-2">
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => handleClassSelect(cls.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                          selectedClass === cls.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {cls.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Attendance Marking */}
            <div className="lg:col-span-3">
              {selectedClass ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 border-b flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={exportAttendance}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      <Download size={16} /> Export CSV
                    </button>
                  </div>

                  {loading ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-600">Loading students...</p>
                    </div>
                  ) : students.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-600">No students in this class.</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100 border-b">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Student Name
                              </th>
                              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student) => (
                              <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-gray-800 font-medium">{student.name}</td>
                                <td className="px-6 py-4">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => toggleAttendance(student.id)}
                                      className={`flex items-center gap-1 px-4 py-2 rounded-lg transition font-medium ${
                                        attendance[student.id] === "present"
                                          ? "bg-green-100 text-green-700 border-2 border-green-600"
                                          : "bg-gray-100 text-gray-600 border-2 border-gray-300"
                                      }`}
                                    >
                                      <Check size={18} /> Present
                                    </button>
                                    <button
                                      onClick={() => toggleAttendance(student.id)}
                                      className={`flex items-center gap-1 px-4 py-2 rounded-lg transition font-medium ${
                                        attendance[student.id] === "absent"
                                          ? "bg-red-100 text-red-700 border-2 border-red-600"
                                          : "bg-gray-100 text-gray-600 border-2 border-gray-300"
                                      }`}
                                    >
                                      <X size={18} /> Absent
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-6 border-t flex gap-3">
                        <button
                          onClick={submitAttendance}
                          disabled={submitting}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                        >
                          {submitting ? "Saving..." : "Save Attendance"}
                        </button>
                        <button
                          onClick={() => setSelectedClass(null)}
                          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg">Select a class to mark attendance</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
