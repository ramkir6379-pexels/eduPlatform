"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";

interface EmotionData {
  emotion: string;
  count: string;
}

interface EmotionResponse {
  data: EmotionData[];
  insight: string;
}

interface EmotionDistributionProps {
  sessionId: string;
}

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  angry: "😡",
  sad: "😢",
  surprised: "😮",
  disgusted: "🤢",
  fear: "😨",
};

const emotionColors: Record<string, string> = {
  happy: "bg-green-500",
  neutral: "bg-gray-500",
  angry: "bg-red-500",
  sad: "bg-blue-500",
  surprised: "bg-yellow-500",
  disgusted: "bg-purple-500",
  fear: "bg-orange-500",
};

const getInsightColor = (insight: string): string => {
  if (insight.includes("struggling")) return "text-red-600";
  if (insight.includes("highly engaged")) return "text-green-600";
  if (insight.includes("needs more")) return "text-yellow-600";
  return "text-gray-600";
};

export default function EmotionDistribution({ sessionId }: EmotionDistributionProps) {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchEmotionData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/analytics/emotion-distribution/${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch emotion data");
        const data: EmotionResponse = await res.json();
        setEmotions(data.data);
        setInsight(data.insight);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionData();
  }, [sessionId]);

  if (loading) return <div className="text-gray-600">Loading emotion data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (emotions.length === 0) return <div className="text-gray-600">No emotion data available</div>;

  const totalCount = emotions.reduce((sum, e) => sum + parseInt(e.count), 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Emotion Distribution</h3>
        <p className={`font-semibold text-base ${getInsightColor(insight)}`}>
          💡 {insight}
        </p>
      </div>
      <div className="space-y-4">
        {emotions.map((emotion) => {
          const percentage = ((parseInt(emotion.count) / totalCount) * 100).toFixed(1);
          const emoji = emotionEmojis[emotion.emotion] || "😐";
          const colorClass = emotionColors[emotion.emotion] || "bg-gray-500";

          return (
            <div key={emotion.emotion}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">
                  {emoji} {emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)}
                </span>
                <span className="text-gray-600 text-sm">
                  {emotion.count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${colorClass} h-2 rounded-full transition-all`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
