"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "../globals.css";


interface Quiz {
    id: number;
    title: string;
}

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/quizzes")
            .then((res) => res.json())
            .then((data: Quiz[]) => setQuizzes(data));
    }, []);

    return (
        <div className="page-container">
            <div className="card">
                <button onClick={() => router.back()} className="button button-back mb-6">Back</button>
                <h1 className="title mb-8">Available Quizzes</h1>
                {quizzes.length === 0 ? (
                    <p className="text-gray-500 text-center">No quizzes found.</p>
                ) : (
                    <ul className="space-y-4">
                        {quizzes.map((quiz) => (
                            <li key={quiz.id} className="quiz-item">
                                <Link href={`/quiz/${quiz.id}`} className="block">
                                    <button className="button button-green w-full">
                                        {quiz.title}
                                    </button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}