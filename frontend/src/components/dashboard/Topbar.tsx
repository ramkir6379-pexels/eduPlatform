"use client";

import { Bell, Search, ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TopbarProps {
  title?: string;
  userName?: string;
  role?: string;
}

export default function Topbar({ title, userName = "User", role = "Teacher" }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const titleMap: Record<string, string> = {
    "/dashboard/teacher": "Dashboard",
    "/dashboard/teacher/classes": "Classes",
    "/dashboard/teacher/attendance": "Attendance",
    "/dashboard/teacher/quizzes": "Quiz Management",
    "/dashboard/teacher/live": "Live Class",
    "/dashboard/teacher/settings": "Settings",
    "/dashboard/admin": "Dashboard",
    "/dashboard/admin/users": "Users",
    "/dashboard/admin/classes": "Classes",
    "/dashboard/admin/analytics": "System Analytics",
    "/dashboard/admin/settings": "Settings",
    "/dashboard/student": "Dashboard",
    "/dashboard/student/classes": "Classes",
    "/dashboard/student/quizzes": "Quizzes",
    "/dashboard/student/attendance": "Attendance",
    "/dashboard/student/live": "Live Class",
    "/dashboard/student/settings": "Settings",
  };

  const finalTitle = title || titleMap[pathname] || "Dashboard";

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/90 backdrop-blur border-b border-slate-200 z-40 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{finalTitle}</h1>
        <p className="text-xs text-slate-500">{role} Workspace</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-72">
          <Search size={16} className="text-slate-400" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search..."
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
              {userName.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500">Teacher</p>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-sm">
                <User size={16} />
                Profile
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
