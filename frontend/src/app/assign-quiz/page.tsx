"use client";

import { useEffect, useState } from "react";

export default function AssignQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [classes, setClasses] = useState([]);

  const [quizId, setQuizId] = useState("");
  const [classId, setClassId] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data));

    fetch("http://localhost:5000/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data));
  }, []);

  function assignQuiz() {
    fetch("http://localhost:5000/api/quizzes/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizId,
        classId,
      }),
    });

    alert("Quiz Assigned");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Assign Quiz</h1>

      <div style={{ marginTop: 20 }}>
        <select onChange={(e) => setQuizId(e.target.value)}>
          <option>Select Quiz</option>
          {quizzes.map((q: any) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <select onChange={(e) => setClassId(e.target.value)}>
          <option>Select Class</option>
          {classes.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={assignQuiz} style={{ marginTop: 20 }}>
        Assign
      </button>
    </div>
  );
}
