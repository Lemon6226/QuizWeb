// components/QuizPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../globals.css";

export default function QuizPage() {
    const router = useRouter();
    const { id } = router.query;
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/quiz/${id}`)
            .then((res) => res.json())
            .then((data) => setQuiz(data));
    }, [id]);

    const handleChange = (questionId: number, value: string) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = () => {
        setSubmitted(true);
        alert("Quiz submitted! (Add backend logic for evaluation)");
    };

    if (!quiz) return (
        <div className="page-container">
            <div className="card text-center">
                <h2 className="title">Loading...</h2>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="card">
                <h1 className="title">{quiz.title}</h1>

                <div className="quiz-questions space-y-6">
                    {quiz.questions.map((q: any) => (
                        <div key={q.id} className="quiz-question">
                            <p className="font-semibold mb-2">{q.text}</p>
                            <input
                                type="text"
                                value={answers[q.id] || ""}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                                disabled={submitted}
                                className="input"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                    {!submitted && (<button onClick={handleSubmit} className="button button-primary">Submit Quiz</button>)}
                    {submitted && (<p className="text-green-500 font-semibold">Thank you for playing!</p>)}
                </div>
            </div>
        </div>
    );
}

