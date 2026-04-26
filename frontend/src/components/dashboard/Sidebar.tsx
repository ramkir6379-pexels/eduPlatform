"use client";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Video,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", href: `/dashboard/${role}`, icon: LayoutDashboard },
    { label: "Classes", href: `/dashboard/${role}/classes`, icon: BookOpen },
    {
      label: "Attendance",
      href: `/dashboard/${role}/attendance`,
      icon: ClipboardCheck,
    },
    { label: "Quizzes", href: `/dashboard/${role}/quizzes`, icon: FileText },
    { label: "Live Class", href: `/dashboard/${role}/live`, icon: Video },
    { label: "Settings", href: `/dashboard/${role}/settings`, icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white border-r border-slate-800 px-5 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          EduPlatform
        </h1>
        <p className="text-xs text-slate-400 mt-1">Teacher Workspace</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const ActiveIcon = item.icon;
          const active = pathname === item.href;
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
              <ActiveIcon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
