"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from './components/Navbar';

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="page-container">
            <div className="card">
                {!session ? (
                    <>
                        <h1 className="title">very epic website :P</h1>
                        <div className="button-group">
                            <Link href="/login" passHref><button className="button button-login">Login</button></Link>
                            <Link href="/register" passHref><button className="button button-register">Register</button></Link>
                            <button onClick={() => signIn("google")} className="button button-google">Sign in with Google</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="title">Welcome, {session.user?.name || "User"}!</h1>
                        <p className="email-text">Email: {session.user?.email || "No email provided"}</p>
                        {session.user?.image && (<div className="flex justify-center mb-6"><img src={session.user.image} alt="Profile" className="profile-image" /></div>)}
                    </>
                )}
            </div>
            <Navbar />
        </div>
    );
}
