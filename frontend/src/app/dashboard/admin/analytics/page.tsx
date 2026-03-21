"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ClassOverview from "@/components/ClassOverview";

export default function AdminAnalyticsPage() {
  return (
    <div className="flex">
      <Sidebar role="admin" />

      <div className="ml-64 w-full">
        <Topbar title="System Analytics" userName="Admin" role="admin" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Attendance</span>
                  <span className="text-2xl font-bold text-green-600">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "88%" }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quiz Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="text-2xl font-bold text-blue-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">User Growth</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-bold text-gray-800">124</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Teachers</span>
                  <span className="font-bold text-gray-800">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Classes</span>
                  <span className="font-bold text-gray-800">8</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Quizzes</span>
                  <span className="font-bold text-gray-800">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Submissions</span>
                  <span className="font-bold text-gray-800">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">System Health</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          {/* All Classes Overview */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">All Classes Overview</h3>
            <ClassOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
