"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function AdminQuizzesPage() {
  return (
    <div className="flex">
      <Sidebar role="admin" />

      <div className="ml-64 w-full">
        <Topbar title="All Quizzes" userName="Ramki" role="admin" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Quizzes</h2>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600">Quiz data will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
