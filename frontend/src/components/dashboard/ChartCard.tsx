"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}
