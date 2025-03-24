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
        <div>
            <h2>Login</h2>
        <form onSubmit={handleLogin}>
    <input
        type="email"
    placeholder="Email"
    onChange={(e) => setEmail(e.target.value)}
    />
    <input
    type="password"
    placeholder="Password"
    onChange={(e) => setPassword(e.target.value)}
    />
    <button type="submit">Login</button>
        </form>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
        );
}
