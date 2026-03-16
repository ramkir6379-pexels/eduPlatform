"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // Redirect to dashboard based on role
      router.push(`/dashboard/${role}`);
    } else {
      // Redirect to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">EduPlatform</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
