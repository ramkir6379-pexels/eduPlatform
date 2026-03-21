"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";

interface QuizStats {
  avg_score: number;
  total_submissions: number;
  unique_students: number;
}

interface QuizPerformanceProps {
  classId: string;
}

export default function QuizPerformance({ classId }: QuizPerformanceProps) {
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) return;

    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/analytics/quiz-performance/${classId}`);
        if (!res.ok) throw new Error("Failed to fetch quiz data");
        const data = await res.json();
        setQuizStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [classId]);

  if (loading) return <div className="text-gray-600">Loading quiz data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!quizStats) return <div className="text-gray-600">No quiz data available</div>;

  const scorePercentage = Math.round(quizStats.avg_score || 0);
  const scoreColor = scorePercentage >= 70 ? "text-green-600" : scorePercentage >= 50 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Quiz Performance</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Average Score</span>
          <span className={`text-3xl font-bold ${scoreColor}`}>
            {scorePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              scorePercentage >= 70 ? "bg-green-500" : scorePercentage >= 50 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-800">{quizStats.total_submissions || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Students Participated</p>
            <p className="text-2xl font-bold text-gray-800">{quizStats.unique_students || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
