"use client";

import { Users, Clock, Play, Eye } from "lucide-react";

interface ClassCardProps {
  id: number;
  name: string;
  teacher: string;
  studentCount: number;
  schedule?: string;
  onStartClass?: () => void;
  onViewStudents?: () => void;
  onJoinClass?: () => void;
  isTeacher?: boolean;
}

export default function ClassCard({
  id,
  name,
  teacher,
  studentCount,
  schedule,
  onStartClass,
  onViewStudents,
  onJoinClass,
  isTeacher = false,
}: ClassCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">Teacher: {teacher}</p>
      </div>

      <div className="flex items-center gap-4 mb-4 text-gray-600">
        <div className="flex items-center gap-1">
          <Users size={18} />
          <span className="text-sm">{studentCount} Students</span>
        </div>
        {schedule && (
          <div className="flex items-center gap-1">
            <Clock size={18} />
            <span className="text-sm">{schedule}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {isTeacher ? (
          <>
            <button
              onClick={onStartClass}
              className="flex items-center gap-2 flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Play size={18} /> Start Class
            </button>
            <button
              onClick={onViewStudents}
              className="flex items-center gap-2 flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Eye size={18} /> View Students
            </button>
          </>
        ) : (
          <button
            onClick={onJoinClass}
            className="flex items-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition justify-center"
          >
            <Play size={18} /> Join Live Class
          </button>
        )}
      </div>
    </div>
  );
}
