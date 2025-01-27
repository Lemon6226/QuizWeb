"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {!session ? (
                <>
                    <h1>Welcome to My App</h1>
                    <button onClick={() => signIn("google")}>Sign in with Google</button>
                </>
            ) : (
                <>
                    <h1>Welcome, {session.user?.name || "User"}!</h1>
                    <p>Email: {session.user?.email || "No email provided"}</p>
                    <img
                        src={session.user?.image || ""}
                        alt="Profile"
                        style={{ borderRadius: "50%", width: "100px" }}
                    />
                    <button onClick={() => signOut()}>Sign out</button>
                </>
            )}
        </div>
    );
}