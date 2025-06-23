"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-blue-600 text-white shadow-md p-4 flex items-center justify-center justify-between">
            <div>
                {session ? (
                    <div className="card">
                        <div className="flex items-center gap-4 flex-wrap">
                            <Link href="/create-quiz">
                                <button className="button button-create-quiz">
                                    ➕ Create Quiz
                                </button>
                            </Link>
                            <Link href="/pages/quizzes">
                                <button className="button button-play-quizzes">
                                    🏆 Play Quizzes
                                </button>
                            </Link>
                            <Link href="/leaderboard">
                                <button className="button button-leaderboard">
                                    Leader board
                                </button>
                            </Link>

                            <button onClick={() => signOut()} className="button button-logout">
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (<div></div>)}
            </div>
        </nav>
    );
}
