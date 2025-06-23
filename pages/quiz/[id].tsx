import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from "next/router";

import { PrismaClient } from "@prisma/client";

import "../../app/globals.css";

const prisma = new PrismaClient();

interface Question {
    id: number;
    text: string;
    options: string[];
    answer: string;
}

interface Quiz {
    id: number;
    title: string;
    questions: Question[];
}

interface QuizPageProps {
    quiz: Quiz | null;
}

export default function QuizPage({ quiz }: QuizPageProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const router = useRouter();

    if (!quiz) {
        return (
            <div className="page-container">
                <p>Quiz not found or failed to load.</p>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = async () => {
        if (selectedAnswer === currentQuestion.answer) {
            setScore(score + 1);
        }
        setSelectedAnswer(null);
        if (currentQuestionIndex + 1 < quiz.questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowScore(true);

            const finalScore = selectedAnswer === currentQuestion.answer ? score + 1 : score;
            try {
                await fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quizId: quiz.id,
                        points: finalScore,
                    }),
                });
            } catch (err) {
                console.error('Failed to save score', err);
            }
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowScore(false);
    };

    return (
        <div className="page-container">
            <div className="card">
                <button onClick={() => router.back()} className="button button-back mb-6">Back</button>
                <h1 className="title mb-6">{quiz.title}</h1>
                {showScore ? (
                    <>
                        <p className="text-center text-lg mb-4">
                            Your score: {score} / {quiz.questions.length}
                        </p>
                        <button onClick={handleRestart} className="button button-green w-full">
                            Restart Quiz
                        </button>
                    </>
                ) : (
                    <>
                        <p className="mb-4 text-lg">{currentQuestion.text}</p>
                        <ul className="space-y-2 mb-4">
                            {currentQuestion.options.map((option) => (
                                <li key={option}>
                                    <button
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`button w-full text-left ${
                                            selectedAnswer === option ? 'button-selected' : 'button-light'
                                        }`}
                                        disabled={selectedAnswer !== null}
                                    >
                                        {option}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleNextQuestion}
                            className="button button-green w-full"
                            disabled={selectedAnswer === null}
                        >
                            {currentQuestionIndex + 1 === quiz.questions.length ? 'Finish' : 'Next'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;

    if (!id || Array.isArray(id)) {
        return { props: { quiz: null } };
    }

    const quiz = await prisma.quiz.findUnique({
        where: { id: parseInt(id as string) },
        include: {
            questions: {
                select: {
                    id: true,
                    text: true,
                    options: true,
                    answer: true,
                },
            },
        },
    });

    if (!quiz) {
        return { props: { quiz: null } };
    }

    return { props: { quiz } };
};