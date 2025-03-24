"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateQuiz() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([{ text: "" }]);
    const [error, setError] = useState("");

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
        <div>
            <h2>Create a Quiz</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Quiz Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            {questions.map((q, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Question"
                        value={q.text}
                        onChange={(e) => updateQuestion(index, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={addQuestion}>Add Question</button>
            <button onClick={handleSubmit}>Create Quiz</button>
        </div>
    );
}
