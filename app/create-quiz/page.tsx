"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../globals.css";

export default function CreateQuiz() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([{ text: "", options: [""], answer: "" }]);
    const [error, setError] = useState("");
    const router = useRouter();

    const addQuestion = () => {
        setQuestions([...questions, { text: "", options: [""], answer: ""}]);
    };
    const updateQuestion = (index: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        if (!session) {
            setError("You must be logged in to create a quiz.");
            return;
        }

        const res = await fetch("/api/quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, questions }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.message);
        } else {
            alert("Quiz created successfully!");
            setTitle("");
            setQuestions([{ text: "", options: [""], answer: ""}]);
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <button onClick={() => router.back()} className="button button-back mb-6">Back</button>
                <h2 className="title">Create a Quiz</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                />
                <div className="question-list">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="mb-4">
                            <input
                                type="text"
                                placeholder={`Question ${qIndex + 1}`}
                                value={q.text}
                                onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[qIndex].text = e.target.value;
                                    setQuestions(newQuestions);
                                }}
                                className="input mb-2"
                            />

                            {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2 mb-1">
                                    <input
                                        type="text"
                                        placeholder={`Option ${optIndex + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].options[optIndex] = e.target.value;
                                            setQuestions(newQuestions);
                                        }}
                                        className="input flex-1"
                                    />
                                    <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        checked={q.answer === opt}
                                        onChange={() => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].answer = opt;
                                            setQuestions(newQuestions);
                                        }}
                                    />
                                    <span>Correct</span>
                                </div>
                            ))}

                            <div className="flex gap-2 mt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newQuestions = [...questions];
                                        newQuestions[qIndex].options.push("");
                                        setQuestions(newQuestions);
                                    }}
                                    className="button button-light"
                                >
                                    Add Option
                                </button>
                                {q.options.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].options.pop();
                                            setQuestions(newQuestions);
                                        }}
                                        className="button button-red"
                                    >
                                        Remove Option
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                    <button onClick={addQuestion} className="button button-add">Add Question</button>
                    <button onClick={handleSubmit} className="button button-primary">Create Quiz</button>
                </div>
            </div>
        </div>
    );
}





