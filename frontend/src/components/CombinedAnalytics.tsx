"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";

interface CombinedData {
  avgEngagement: number;
  avgScore: number;
  insight: string;
}

interface CombinedAnalyticsProps {
  classId: string;
  sessionId: string;
}

const getInsightColor = (insight: string): string => {
  if (insight.includes("intervention")) return "text-red-600";
  if (insight.includes("Excellent")) return "text-green-600";
  if (insight.includes("low")) return "text-yellow-600";
  return "text-gray-600";
};

export default function CombinedAnalytics({ classId, sessionId }: CombinedAnalyticsProps) {
  const [data, setData] = useState<CombinedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId || !sessionId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/analytics/combined/${classId}/${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, sessionId]);

  if (loading) return <div className="text-gray-600">Loading analytics...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div className="text-gray-600">No data available</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Insights</h3>
      
      <div className="mb-6">
        <p className={`font-semibold text-base ${getInsightColor(data.insight)}`}>
          🎯 {data.insight}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-2">Engagement Level</p>
          <p className="text-3xl font-bold text-blue-600">{Math.round(data.avgEngagement * 100)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min(data.avgEngagement * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-2">Quiz Performance</p>
          <p className="text-3xl font-bold text-green-600">{Math.round(data.avgScore)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${Math.min(data.avgScore, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">How to interpret:</span> When engagement and quiz scores are both high, students are learning effectively. Low engagement combined with poor quiz performance indicates a need for intervention.
        </p>
      </div>
    </div>
  );
}
