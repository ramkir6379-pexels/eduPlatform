"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function StudentSettingsPage() {
  return (
    <div className="flex">
      <Sidebar role="student" />

      <div className="ml-64 w-full">
        <Topbar title="Settings" userName="Student" role="student" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>

          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Student Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="student@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                    <input
                      type="text"
                      defaultValue="CS001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-gray-700">Email notifications for new quizzes</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-gray-700">Email notifications for attendance</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Save Changes
                </button>
                <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
