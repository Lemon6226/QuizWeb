"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md">
            <h1 className="text-xl font-bold">Quiz App</h1>
            <div>
                {session ? (
                    <>
                        <span className="mr-4">Welcomeee, {session.user?.name}!</span>
                        <Link href="/create-quiz">
                            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg mr-4 transition">
                                ➕ Create Quiz
                            </button>
                        </Link>
                        <Link href="/quizzes">
                            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">
                                🏆 Play Quizzes
                            </button>
                        </Link>

                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <Link href="/login">
                        <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition">
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
