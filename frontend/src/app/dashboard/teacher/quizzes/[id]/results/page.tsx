"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";

interface QuizResult {
  student_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
}

export default function QuizResultsPage() {
  const params = useParams();
  const quizId = params.id;

  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    fetchResults();
  }, [quizId]);

  const fetchResults = async () => {
    try {
      // Fetch quiz title
      const quizRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}`);
      const quizData = await quizRes.json();
      setQuizTitle(quizData.title);

      // Fetch results
      const resultsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/results/${quizId}`);
      const resultsData = await resultsRes.json();
      setResults(resultsData);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const averageScore = Array.isArray(results) && results.length > 0
    ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1)
    : 0;

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Quiz Results" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Back Button */}
          <Link
            href="/dashboard/teacher/quizzes"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft size={20} /> Back to Quizzes
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quizTitle}</h1>
            <p className="text-gray-600">Quiz Results & Analytics</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Submissions</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{results.length}</p>
                </div>
                <BarChart3 className="text-blue-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Score</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{averageScore}%</p>
                </div>
                <BarChart3 className="text-green-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Highest Score</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">
                    {Array.isArray(results) && results.length > 0 ? Math.max(...results.map(r => r.percentage)) : 0}%
                  </p>
                </div>
                <BarChart3 className="text-purple-600" size={40} />
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Student Results</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading results...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">📋 No submissions yet.</p>
                <p className="text-gray-500">Students will appear here once they submit the quiz.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(results) && results.map((result, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          {result.student_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {result.score}/{result.total_questions}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              result.percentage >= 80
                                ? "bg-green-100 text-green-800"
                                : result.percentage >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(result.submitted_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
