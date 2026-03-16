"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Plus, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface Quiz {
  id: number;
  title: string;
  description?: string;
  class_name?: string;
  question_count: number;
  created_at: string;
}

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/quizzes/teacher/2");
      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: "DELETE",
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

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Quiz Management" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Create Quiz Button */}
          <div className="mb-8">
            <Link
              href="/dashboard/teacher/quizzes/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} /> Create New Quiz
            </Link>
          </div>

          {/* Quizzes List */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Quizzes</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading quizzes...</p>
              </div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">📝 No quizzes created yet.</p>
              <p className="text-gray-500 mb-6">Create your first quiz to get started.</p>
              <Link
                href="/dashboard/teacher/quizzes/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus size={20} /> Create Quiz
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{quiz.description}</p>
                  )}

                  <div className="mb-4 text-sm text-gray-600 space-y-1">
                    <p>Questions: {quiz.question_count}</p>
                    {quiz.class_name && <p>Class: {quiz.class_name}</p>}
                    <p>Created: {new Date(quiz.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/teacher/quizzes/${quiz.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      <Eye size={16} /> View
                    </Link>
                    <Link
                      href={`/dashboard/teacher/quizzes/${quiz.id}/results`}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      <Eye size={16} /> Results
                    </Link>
                    <button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
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
