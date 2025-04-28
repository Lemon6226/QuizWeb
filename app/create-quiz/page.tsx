"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../globals.css";

export default function CreateQuiz() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([{ text: "" }]);
    const [error, setError] = useState("");
    const router = useRouter();

    const addQuestion = () => {
        setQuestions([...questions, { text: "" }]);
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
            setQuestions([{ text: "" }]);
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
                    {questions.map((q, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder={`Question ${index + 1}`}
                                value={q.text}
                                onChange={(e) => updateQuestion(index, e.target.value)}
                                className="input mt-2"
                            />
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

