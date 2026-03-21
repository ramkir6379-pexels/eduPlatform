"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/config";

interface LiveQuizAnalyticsProps {
  sessionId: string;
}

interface AnalyticsData {
  avg_score: number;
  total_submissions: number;
  correct_count: number;
  unique_students: number;
  accuracy: number;
}

export default function LiveQuizAnalytics({ sessionId }: LiveQuizAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);

  // Fetch analytics function
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/live-quiz/analytics/${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err instanceof Error ? err.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    // Initial fetch
    fetchAnalytics();

    // Setup socket connection for real-time updates
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Analytics socket connected");
      socketInstance.join(sessionId);
    });

    // Listen for quiz analytics updates
    socketInstance.on("quiz_analytics_update", () => {
      console.log("Received quiz_analytics_update, refreshing...");
      fetchAnalytics();
    });

    // Fallback: poll every 2 seconds
    const interval = setInterval(fetchAnalytics, 2000);

    return () => {
      clearInterval(interval);
      socketInstance.disconnect();
    };
  }, [sessionId]);

  if (loading) return <div className="text-gray-600">Loading quiz analytics...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!analytics) return <div className="text-gray-600">No quiz data available</div>;

  return (
    <div className="fixed bottom-6 left-6 bg-white rounded-lg shadow-lg p-6 w-80 z-40">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Live Quiz Analytics</h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-1">Average Score</p>
          <p className="text-3xl font-bold text-blue-600">{analytics.avg_score}%</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-gray-600 text-xs mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-green-600">{analytics.accuracy}%</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-gray-600 text-xs mb-1">Submissions</p>
            <p className="text-2xl font-bold text-purple-600">{analytics.total_submissions}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-gray-600 text-xs mb-1">Correct</p>
            <p className="text-2xl font-bold text-yellow-600">{analytics.correct_count}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-gray-600 text-xs mb-1">Students</p>
            <p className="text-2xl font-bold text-indigo-600">{analytics.unique_students}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
