"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function TeacherSettingsPage() {
  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Settings" userName="Ramki" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
          
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h3>
            <p className="text-gray-600">Settings options will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
