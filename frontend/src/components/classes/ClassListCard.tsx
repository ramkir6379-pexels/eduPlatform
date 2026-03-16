"use client";

import { BookOpen, Users, Clock, Play, Eye } from "lucide-react";

interface ClassListCardProps {
  id: number;
  name: string;
  studentCount: number;
  schedule?: string;
  teacher?: string;
  isTeacher?: boolean;
  onOpen: () => void;
  onStartLive?: () => void;
  onJoinLive?: () => void;
}

export default function ClassListCard({
  id,
  name,
  studentCount,
  schedule,
  teacher,
  isTeacher,
  onOpen,
  onStartLive,
  onJoinLive,
}: ClassListCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <BookOpen className="text-blue-600 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{name}</h3>
            {teacher && <p className="text-gray-600 text-sm">Teacher: {teacher}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={16} />
          <span className="text-sm">{studentCount} Students</span>
        </div>
        {schedule && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span className="text-sm">{schedule}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpen}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Eye size={16} /> Open
        </button>

        {isTeacher && onStartLive ? (
          <button
            onClick={onStartLive}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            <Play size={16} /> Start Live
          </button>
        ) : onJoinLive ? (
          <button
            onClick={onJoinLive}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            <Play size={16} /> Join Live
          </button>
        ) : null}
      </div>
    </div>
  );
}
