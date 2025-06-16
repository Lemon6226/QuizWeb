"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Question {
    text: string;
    isCorrect: boolean;
}

export default function CreateQuiz() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<Question[]>([
        { text: "", isCorrect: false },
    ]);
    const [error, setError] = useState<string>("");

    const router = useRouter();

    const addQuestion = () => {
        setQuestions((prev) => [...prev, { text: "", isCorrect: false }]);
    };

    const updateQuestion = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[index] = { ...(updated[index]), [field]: value };
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (!session) {
            setError("You must be logged in to create a quiz.");
            return;
        }

        if (title.trim().length === 0) {
            setError("Quiz title cannot be empty.");
            return;
        }

        if (questions.some((q) => q.text.trim().length === 0)) {
            setError("All questions must have text.");
            return;
        }

        try {
            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, questions }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message);
                return;
            }

            alert("Quiz created successfully!");
            setTitle('');
            setQuestions([{ text: "", isCorrect: false }]);

            router.push('/quizzes'); // Redirect back to quizzes
        } catch (error) {
            console.error(error);
            setError("Failed to create quiz.");
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <button onClick={() => router.back()} className="button button-back mb-6">
                    Back
                </button>

                <h2 className="title">Create a Quiz</h2>

                {error && <p className="error-message">{error}</p>}

                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                />

                <div className="question-list mt-4">
                    {questions.map((q, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-md">
                            <input
                                type="text"
                                placeholder={`Question ${index + 1}`}
                                value={q.text}
                                onChange={(e) => updateQuestion(index, "text", e.target.value)}
                                className="input mt-2 mr-4"
                            />

                            <label className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={q.isCorrect}
                                    onChange={(e) =>
                                        updateQuestion(index, "isCorrect", e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                Correct Answer
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={addQuestion} className="button button-add">
                        Add Question
                    </button>
                    <button onClick={handleSubmit} className="button button-primary">
                        Create Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}
