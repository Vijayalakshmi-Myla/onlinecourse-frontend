 "use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; 
import { useSession } from "@supabase/auth-helpers-react";

export default function QuizForm({ quiz, courseId }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const session = useSession(); 

  const handleChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      alert("You must be logged in to submit the quiz.");
      return;
    }

    // Calculate score
    let newScore = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        newScore += 1;
      }
    });

    setScore(newScore);
    setSubmitted(true);

    // Insert quiz result into Supabase
    const { error } = await supabase.from("user_quiz_results").insert([
      {
        user_id: session.user.id,
        course_id: courseId,
        quiz_id: quiz.id,
        score: newScore,
        total: quiz.questions.length,
      },
    ]);

    if (error) {
      console.error("Error saving quiz result:", error.message);
    } else {
      console.log("Quiz result saved successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {quiz.questions.map((q, idx) => (
        <div key={q.id || idx} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">
            {idx + 1}. {q.question}
          </h3>
          <div className="space-y-2">
            {q.options.map((opt) => {
              const isSelected = answers[q.id] === opt;
              const isCorrect = submitted && q.correctAnswer === opt;
              const isWrong = submitted && isSelected && opt !== q.correctAnswer;

              return (
                <label
                  key={opt}
                  className={`flex items-center space-x-2 cursor-pointer p-2 rounded ${
                    isCorrect ? "bg-green-100" : ""
                  } ${isWrong ? "bg-red-100" : ""}`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleChange(q.id, opt)}
                    disabled={submitted}
                    className="form-radio text-blue-600"
                  />
                  <span>{opt}</span>
                  {isCorrect && <span className="text-green-600 font-bold ml-2">✓</span>}
                  {isWrong && <span className="text-red-600 font-bold ml-2">✗</span>}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="text-xl font-bold">
          You scored {score} out of {quiz.questions.length}
        </div>
      )}
    </form>
  );
}
