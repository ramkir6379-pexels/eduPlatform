"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/config";

interface Class {
  id: number;
  name: string;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/classes/teacher/2`);
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          teacher_id: 2,
          class_id: classId ? parseInt(classId) : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Quiz created! Now add questions.");
        router.push(`/dashboard/teacher/quizzes/${data.id}`);
      } else {
        alert("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Create Quiz" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Back Button */}
          <Link
            href="/dashboard/teacher/quizzes"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} /> Back to Quizzes
          </Link>

          {/* Create Quiz Form */}
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Quiz</h1>

            <form onSubmit={handleCreateQuiz} className="space-y-6">
              {/* Quiz Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., JavaScript Basics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Quiz description (optional)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* Select Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Class (Optional)
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Select a class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                >
                  {loading ? "Creating..." : "Create Quiz"}
                </button>
                <Link
                  href="/dashboard/teacher/quizzes"
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
