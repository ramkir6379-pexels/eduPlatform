"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md border-l-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      style={{ borderColor: color }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
