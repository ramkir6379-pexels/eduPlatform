"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

interface AttendanceRecord {
  id: number;
  class_name: string;
  date: string;
  status: string;
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/student/3`);
      const data = await res.json();
      setAttendance(data);

      // Calculate attendance percentage
      if (data.length > 0) {
        const presentCount = data.filter((record: AttendanceRecord) => record.status === "present").length;
        const percentage = Math.round((presentCount / data.length) * 100);
        setAttendancePercentage(percentage);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "present") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Present
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
        Absent
      </span>
    );
  };

  return (
    <div className="flex">
      <Sidebar role="student" />

      <div className="ml-64 w-full">
        <Topbar title="My Attendance" userName="Student" role="student" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Attendance Percentage Card */}
          {attendance.length > 0 && (
            <div className="mb-8 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Overall Attendance</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{attendancePercentage}%</p>
                </div>
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{attendancePercentage}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Records */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Records</h2>

          {loading ? (
            <p className="text-gray-600">Loading attendance...</p>
          ) : attendance.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">No attendance records yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Class</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{record.class_name}</td>
                      <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
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
