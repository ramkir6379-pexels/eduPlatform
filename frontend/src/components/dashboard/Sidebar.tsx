"use client";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Video,
  Settings,
  FileText,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  role: string;
};

export default function Sidebar({ role }: Props) {
  const pathname = usePathname();

  const teacherItems = [
    { label: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
    { label: "Classes", href: "/dashboard/teacher/classes", icon: BookOpen },
    {
      label: "Attendance",
      href: "/dashboard/teacher/attendance",
      icon: ClipboardCheck,
    },
    { label: "Quizzes", href: "/dashboard/teacher/quizzes", icon: FileText },
    { label: "Live Class", href: "/dashboard/teacher/live", icon: Video },
    { label: "Settings", href: "/dashboard/teacher/settings", icon: Settings },
  ];

  const studentItems = [
    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "Classes", href: "/dashboard/student/classes", icon: BookOpen },
    {
      label: "Attendance",
      href: "/dashboard/student/attendance",
      icon: ClipboardCheck,
    },
    { label: "Quizzes", href: "/dashboard/student/quizzes", icon: FileText },
    { label: "Live Class", href: "/dashboard/student/live", icon: Video },
    { label: "Settings", href: "/dashboard/student/settings", icon: Settings },
  ];

  const adminItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Classes", href: "/dashboard/admin/classes", icon: BookOpen },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  const items =
    role === "admin"
      ? adminItems
      : role === "student"
      ? studentItems
      : teacherItems;

  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white border-r border-slate-800 px-5 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          EduPlatform
        </h1>
        <p className="text-xs text-slate-400 mt-1">{roleLabel} Workspace</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
