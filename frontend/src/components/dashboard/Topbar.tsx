"use client";

import { Bell, User, Search } from "lucide-react";

export default function Topbar({ title, userName = "Admin", role = "admin" }: { title: string; userName?: string; role?: string }) {
  return (
    <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{userName}</p>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
              {role}
            </span>
          </div>
          <Bell size={24} className="text-gray-600 cursor-pointer hover:text-blue-600" />
          <User size={24} className="text-gray-600 cursor-pointer hover:text-blue-600" />
        </div>
      </div>
    </div>
  );
}
