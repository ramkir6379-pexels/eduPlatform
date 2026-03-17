"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/config";

interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
}

interface SubmitResult {
  success: boolean;
  score: number;
  totalQuestions: number;
  percentage: number;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Timer effect
  useEffect(() => {
    if (submitted || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, loading]);

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const quizRes = await fetch(`${API_URL}/api/quizzes/${quizId}`);
      const quizData = await quizRes.json();
      setQuiz(quizData);

      const questionsRes = await fetch(`${API_URL}/api/quizzes/questions/${quizId}`);
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit the quiz?")) return;

    setSubmitting(true);
    try {
      const studentId = localStorage.getItem("userId") || "3";
      const formattedAnswers: { [key: number]: string } = {};
      questions.forEach((q) => {
        formattedAnswers[q.id] = answers[q.id] || "";
      });

      const res = await fetch(`${API_URL}/api/quizzes/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id: quizId,
          student_id: parseInt(studentId),
          answers: formattedAnswers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Submitted!</h1>
          <p className="text-gray-600 mb-6">{quiz?.title}</p>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="text-gray-600 text-sm mb-2">Your Score</p>
            <p className="text-5xl font-bold text-blue-600 mb-2">
              {result.score}/{result.totalQuestions}
            </p>
            <p className="text-2xl font-bold text-green-600">{result.percentage}%</p>
          </div>

          <Link
            href="/dashboard/student/quizzes"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600 text-lg mb-4">📝 No questions in this quiz yet.</p>
          <p className="text-gray-500 mb-6">Please check back later or contact your teacher.</p>
          <Link
            href="/dashboard/student/quizzes"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = answers[question.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/student/quizzes"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft size={20} /> Back to Quizzes
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{quiz?.title}</h1>
            <div className={`text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-gray-600"}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Quiz Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-sm font-medium text-gray-600">
                Answered: {Object.keys(answers).length}/{questions.length}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {["A", "B", "C", "D"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(question.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    answers[question.id] === option
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[question.id] === option
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-400"
                      }`}
                    >
                      {answers[question.id] === option && (
                        <span className="text-white text-sm font-bold">✓</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">
                      {option}: {question[`option_${option.toLowerCase()}` as keyof Question]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Next
              </button>
            )}
          </div>

          {/* Question Indicator */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3 font-medium">Questions:</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition ${
                    index === currentQuestion
                      ? "bg-blue-600 text-white"
                      : answers[q.id]
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
