"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        }) as unknown as { error?: string };


        console.log(result);
        if (result?.error) {
            alert(result.error);
        } else {
            window.location.href = "/";
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <h2 className="title">Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-6">
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <button type="submit" className="button button-login">Login</button>
                </form>
                <button onClick={() => signIn("google")} className="button button-google w-full">Sign in with Google</button>
            </div>
        </div>
    );
}

