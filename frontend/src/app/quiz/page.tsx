"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/quizzes`)
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Available Quizzes</h1>

      {quizzes.map((q: any) => (
        <div key={q.id} style={{ marginTop: 20 }}>
          <h3>{q.title}</h3>
          <a href={`/quiz/${q.id}`}>Attempt Quiz</a>
        </div>
      ))}
    </div>
  );
}
