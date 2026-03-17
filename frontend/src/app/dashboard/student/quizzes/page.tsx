"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface Quiz {
  id: number;
  title: string;
  description?: string;
  class_name?: string;
  question_count?: number;
}

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      // Get student's enrolled classes first
      const classesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/student/3`);
      const classes = await classesRes.json();

      // Fetch quizzes for each class
      const allQuizzes: Quiz[] = [];
      for (const cls of classes) {
        const quizzesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/class/${cls.id}`);
        const classQuizzes = await quizzesRes.json();
        allQuizzes.push(...classQuizzes);
      }

      setQuizzes(allQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="student" />

      <div className="ml-64 w-full">
        <Topbar title="Available Quizzes" userName="Student" role="student" />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quizzes</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading quizzes...</p>
              </div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-2">📝 No quizzes available yet.</p>
              <p className="text-gray-500">Check back later for new quizzes from your teachers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
                      {quiz.class_name && (
                        <p className="text-gray-600 text-sm">Class: {quiz.class_name}</p>
                      )}
                    </div>
                  </div>

                  {quiz.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                  )}

                  <div className="mb-4 text-sm text-gray-600">
                    <p>Questions: {quiz.question_count || 0}</p>
                  </div>

                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="w-full block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Start Quiz
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
