"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Plus, Trash2, Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/config";

interface Quiz {
  id: number;
  title: string;
  description?: string;
  class_name?: string;
  question_count: number;
  created_at: string;
  is_live?: boolean;
  session_id?: string | null;
}

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState<"all" | "bank" | "live">("all");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/quizzes/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchQuizzes();
        alert("Quiz deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Error deleting quiz");
    }
  };

  const filteredQuizzes = quizzes
    .filter((quiz) => {
      if (tab === "bank") return quiz.is_live !== true;
      if (tab === "live") return quiz.is_live === true;
      return true;
    })
    .filter((quiz) =>
      `${quiz.title} ${quiz.class_name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const bankCount = quizzes.filter((q) => !q.is_live).length;
  const liveCount = quizzes.filter((q) => q.is_live).length;
  const totalQuestions = quizzes.reduce(
    (sum, q) => sum + Number(q.question_count || 0),
    0
  );
  const uniqueClasses = new Set(quizzes.map((q) => q.class_name)).size;

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 pt-16 min-h-screen bg-slate-50 w-full">
        <Topbar userName="Teacher" />

        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Your Quizzes</h2>
              <p className="text-sm text-slate-500">Create, manage and review quiz performance.</p>
            </div>
            <Link
              href="/dashboard/teacher/quizzes/create"
              className="px-5 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Create Quiz
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Quiz Bank</p>
              <p className="text-3xl font-semibold mt-2 text-slate-900">{bankCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Live Quizzes</p>
              <p className="text-3xl font-semibold mt-2 text-slate-900">{liveCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Questions</p>
              <p className="text-3xl font-semibold mt-2 text-slate-900">{totalQuestions}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500">Active Classes</p>
              <p className="text-3xl font-semibold mt-2 text-slate-900">{uniqueClasses}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {["all", "bank", "live"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item as "all" | "bank" | "live")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  tab === item
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {item === "all" ? "All" : item === "bank" ? "Quiz Bank" : "Live Quizzes"}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by title or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Loading quizzes...</p>
              </div>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
              <p className="text-slate-600 text-lg mb-4">📝 No quizzes found.</p>
              <p className="text-slate-500 mb-6">
                {searchTerm ? "Try adjusting your search." : "Create your first quiz to get started."}
              </p>
              {!searchTerm && (
                <Link
                  href="/dashboard/teacher/quizzes/create"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  <Plus size={18} />
                  Create Quiz
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition"
                >
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 line-clamp-2">
                    {quiz.title}
                  </h3>

                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        quiz.is_live
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {quiz.is_live ? "Live Quiz" : "Quiz Bank"}
                    </span>
                    {quiz.class_name && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {quiz.class_name}
                      </span>
                    )}
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                      {quiz.question_count} questions
                    </span>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-slate-500 mb-4">
                    Created {new Date(quiz.created_at).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/teacher/quizzes/${quiz.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-medium"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/teacher/quizzes/${quiz.id}/results`}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-200 transition text-sm font-medium"
                    >
                      <Eye size={16} />
                      Results
                    </Link>
                    {!quiz.is_live && (
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="px-3 py-2 text-slate-600 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
