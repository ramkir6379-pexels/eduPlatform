"use client";

import {
  LayoutDashboard,
  Users,
  Video,
  ClipboardCheck,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const getMenuItems = () => {
    const baseItems = [
      { label: "Dashboard", icon: LayoutDashboard, href: `/dashboard/${role}` },
    ];

    if (role === "admin") {
      return [
        ...baseItems,
        { label: "Users", icon: Users, href: "/dashboard/admin/users" },
        { label: "Classes", icon: BookOpen, href: "/dashboard/admin/classes" },
        { label: "Analytics", icon: BarChart3, href: "/dashboard/admin/analytics" },
        { label: "Settings", icon: Settings, href: "/dashboard/admin/settings" },
      ];
    }

    if (role === "teacher") {
      return [
        ...baseItems,
        { label: "Classes", icon: BookOpen, href: `/dashboard/${role}/classes` },
        { label: "Attendance", icon: ClipboardCheck, href: `/dashboard/${role}/attendance` },
        { label: "Quizzes", icon: BookOpen, href: `/dashboard/${role}/quizzes` },
        { label: "Live Class", icon: Video, href: `/dashboard/${role}/live` },
        { label: "Settings", icon: Settings, href: `/dashboard/${role}/settings` },
      ];
    }

    // Student
    return [
      ...baseItems,
      { label: "Classes", icon: BookOpen, href: `/dashboard/${role}/classes` },
      { label: "Quizzes", icon: BookOpen, href: `/dashboard/${role}/quizzes` },
      { label: "Attendance", icon: ClipboardCheck, href: `/dashboard/${role}/attendance` },
      { label: "Live Class", icon: Video, href: `/dashboard/${role}/live` },
      { label: "Settings", icon: Settings, href: `/dashboard/${role}/settings` },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6 fixed">
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        EduPlatform
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
