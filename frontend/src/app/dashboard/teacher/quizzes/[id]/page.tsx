"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  class_id?: number;
}

export default function QuizDetailPage() {
  const params = useParams();
  const quizId = params.id;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
  });

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const quizRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}`);
      const quizData = await quizRes.json();
      setQuiz(quizData);

      const questionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/questions/${quizId}`);
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.option_a.trim() || !formData.option_b.trim() || !formData.option_c.trim() || !formData.option_d.trim()) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id: quizId,
          question: formData.question,
          option_a: formData.option_a,
          option_b: formData.option_b,
          option_c: formData.option_c,
          option_d: formData.option_d,
          correct_answer: formData.correct_answer,
        }),
      });

      if (res.ok) {
        setFormData({
          question: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "A",
        });
        setShowAddQuestion(false);
        fetchQuizData();
        alert("Question added successfully!");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Error adding question");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteQuestion = async (questionId: number) => {
    if (!confirm("Delete this question?")) return;

    try {
      // Note: You may need to add a delete question endpoint
      alert("Delete functionality coming soon");
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="teacher" />
        <div className="ml-64 w-full">
          <Topbar title="Quiz Details" userName="Teacher" role="teacher" />
          <div className="p-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="teacher" />

      <div className="ml-64 w-full">
        <Topbar title="Quiz Details" userName="Teacher" role="teacher" />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Back Button */}
          <Link
            href="/dashboard/teacher/quizzes"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} /> Back to Quizzes
          </Link>

          {/* Quiz Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz?.title}</h1>
            {quiz?.description && (
              <p className="text-gray-600 mb-2">{quiz.description}</p>
            )}
            <p className="text-gray-600 text-sm">Total Questions: {questions.length}</p>
          </div>

          {/* Add Question Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} /> Add Question
            </button>
          </div>

          {/* Add Question Form */}
          {showAddQuestion && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Question</h2>

              <form onSubmit={handleAddQuestion} className="space-y-4">
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter question"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option {option} *
                      </label>
                      <input
                        type="text"
                        value={formData[`option_${option.toLowerCase()}` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [`option_${option.toLowerCase()}`]: e.target.value,
                          })
                        }
                        placeholder={`Option ${option}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={submitting}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer *
                  </label>
                  <select
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={submitting}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
                  >
                    {submitting ? "Adding..." : "Add Question"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddQuestion(false)}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Questions List */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Questions ({questions.length})</h2>

          {questions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">No questions added yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Question {index + 1}: {question.question}
                    </h3>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {["A", "B", "C", "D"].map((option) => (
                      <div
                        key={option}
                        className={`p-3 rounded-lg border-2 ${
                          question.correct_answer === option
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          {option}: {question[`option_${option.toLowerCase()}` as keyof Question]}
                        </p>
                        {question.correct_answer === option && (
                          <p className="text-xs text-green-600 font-bold mt-1">✓ Correct</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
