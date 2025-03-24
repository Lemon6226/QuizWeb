"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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

    if (!quiz) return <p>Loading...</p>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            {quiz.questions.map((q: any) => (
                <div key={q.id}>
                    <p>{q.text}</p>
                    <input
                        type="text"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        disabled={submitted}
                    />
                </div>
            ))}
            {!submitted && <button onClick={handleSubmit}>Submit Quiz</button>}
            {submitted && <p>Thank you for playing!</p>}
        </div>
    );
}
