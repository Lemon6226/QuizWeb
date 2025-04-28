"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Profile() {
    const { data: session } = useSession();
    const [name, setName] = useState(session?.user?.name || "");
    const [image, setImage] = useState(session?.user?.image || "");

    const updateProfile = async () => {
        await fetch("/api/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, image }),
        });
        alert("Profile updated!");
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-4">Edit Profile</h1>
            <input
                className="block border mb-4 p-2"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="block border mb-4 p-2"
                placeholder="Profile Picture URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <button onClick={updateProfile} className="bg-blue-500 px-4 py-2 text-white rounded">
                Save
            </button>
        </div>
    );
}
