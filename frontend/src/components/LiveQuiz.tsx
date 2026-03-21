"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config";
import { X } from "lucide-react";

interface LiveQuizProps {
  socket: any;
  classId: string;
  sessionId: string;
  userRole: "teacher" | "student";
  studentId?: string;
}

interface QuizData {
  id: number;
  question: string;
  options: string[];
  correct_answer?: string;
  session_id: string;
}

export default function LiveQuiz({
  socket,
  classId,
  sessionId,
  userRole,
  studentId,
}: LiveQuizProps) {
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [showTeacherForm, setShowTeacherForm] = useState(false);

  // Listen for live quiz from socket
  useEffect(() => {
    if (!socket) return;

    socket.on("live_quiz", (quiz: QuizData) => {
      console.log("Received live quiz:", quiz);
      setActiveQuiz(quiz);
      setSubmitted(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    });

    return () => {
      socket.off("live_quiz");
    };
  }, [socket]);

  const handleCreateQuiz = async () => {
    if (!quizQuestion || !correctAnswer || quizOptions.some((opt) => !opt)) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/live-quiz/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: quizQuestion,
          options: quizOptions,
          correct_answer: correctAnswer,
          session_id: sessionId,
          class_id: classId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create quiz");

      const data = await response.json();
      console.log("Quiz created:", data);

      // Reset form
      setQuizQuestion("");
      setQuizOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setShowTeacherForm(false);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!activeQuiz || !studentId) return;

    try {
      const response = await fetch(`${API_URL}/api/live-quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id: activeQuiz.id,
          student_id: studentId,
          answer,
          session_id: sessionId,
          class_id: classId,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit answer");

      const data = await response.json();
      setSelectedAnswer(answer);
      setIsCorrect(data.isCorrect);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer");
    }
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setSubmitted(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Teacher form
  if (userRole === "teacher" && showTeacherForm) {
    return (
      <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg p-6 w-96 max-h-96 overflow-y-auto z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Create Live Quiz</h3>
          <button
            onClick={() => setShowTeacherForm(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              value={quizQuestion}
              onChange={(e) => setQuizQuestion(e.target.value)}
              placeholder="Enter question"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {quizOptions.map((option, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Option {String.fromCharCode(65 + idx)}
              </label>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...quizOptions];
                  newOptions[idx] = e.target.value;
                  setQuizOptions(newOptions);
                }}
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select correct answer</option>
              {quizOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option || `Option ${String.fromCharCode(65 + idx)}`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Push Quiz to Students
          </button>
        </div>
      </div>
    );
  }

  // Teacher button
  if (userRole === "teacher") {
    return (
      <>
        <button
          onClick={() => setShowTeacherForm(true)}
          className="fixed bottom-24 right-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition z-40"
        >
          📝 Create Quiz
        </button>
      </>
    );
  }

  // Student quiz display
  if (!activeQuiz) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Live Quiz</h2>
          {submitted && (
            <button
              onClick={closeQuiz}
              className="text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {activeQuiz.question}
          </h3>

          <div className="space-y-3">
            {activeQuiz.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !submitted && handleSubmitAnswer(option)}
                disabled={submitted}
                className={`w-full p-4 text-left rounded-lg font-medium transition ${
                  submitted
                    ? selectedAnswer === option
                      ? isCorrect
                        ? "bg-green-100 border-2 border-green-500 text-green-800"
                        : "bg-red-100 border-2 border-red-500 text-red-800"
                      : option === activeQuiz.correct_answer
                      ? "bg-green-100 border-2 border-green-500 text-green-800"
                      : "bg-gray-100 text-gray-600"
                    : "bg-gray-100 hover:bg-blue-100 border-2 border-gray-300 hover:border-blue-500 text-gray-800"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {submitted && (
          <div
            className={`p-4 rounded-lg text-center font-semibold ${
              isCorrect
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            {!isCorrect && (
              <p className="text-sm mt-2">
                Correct answer: {activeQuiz.correct_answer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
