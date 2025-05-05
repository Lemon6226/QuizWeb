"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";

export default function Leaderboard() {
    const [scores, setScores] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/leaderboard")
            .then((res) => res.json())
            .then((data) => {
                setScores(data);
            })
            .catch((error) => {
                console.error('Error fetching leaderboard:', error);
            });
    }, []);

    return (
        <div className="page-container">
            <div className="card">
                <button onClick={() => router.back()} className="button button-back mb-6">Back</button>
                <h1 className="title">Leaderboard</h1>
                <div className="leaderboard-list">
                    {scores.length > 0 ? (
                        scores.map((s) => (
                            <div key={s.userId} className="leaderboard-item relative group">
                                <img src={s.user.image || "/default-avatar.png"} alt="pfp" className="leaderboard-avatar" />
                                <div className="leaderboard-info">
                                    <p className="font-bold">{s.user.name}</p>
                                    <p className="text-sm text-gray-500">{s.totalPoints} points</p>
                                </div>
                                {/* Hover Profile */}
                                <div className="hover-card group-hover:block">
                                    <h2 className="font-bold">{s.user.name}</h2>
                                    <img src={s.user.image || "/default-avatar.png"} className="hover-avatar" alt="pfp" />
                                    <p className="text-sm text-gray-600">Email: {s.user.email}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No scores yet!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

