"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SessionProvider>{children}</SessionProvider>
        </body>
        </html>
    );
}