"use client";

import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  title?: string;
  userName?: string;
  role?: string;
}

export default function Topbar({
  title,
  userName = "User",
  role = "teacher",
}: Props) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  const autoTitle = pathname
    .split("/")
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const finalTitle =
    title ||
    (pathname === `/dashboard/${role}`
      ? "Dashboard"
      : autoTitle || "Dashboard");

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/90 backdrop-blur border-b border-slate-200 z-40 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {finalTitle}
        </h1>
        <p className="text-xs text-slate-500">
          {roleLabel} Workspace
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-72">
          <Search size={16} className="text-slate-400" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search..."
          />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600"></span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-800">
                {userName}
              </p>
              <p className="text-xs text-slate-500">
                {roleLabel}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-slate-500"
            />
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
