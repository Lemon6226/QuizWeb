"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/quizzes")
            .then((res) => res.json())
            .then((data) => setQuizzes(data));
    }, []);

    return (
        <div>
            <h1>Available Quizzes</h1>
            {quizzes.length === 0 && <p>No quizzes found.</p>}
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        <Link href={`/quiz/${quiz.id}`}>
                            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg">
                                {quiz.title}
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
