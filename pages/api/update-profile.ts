import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, image } = req.body;

    try {
        await prisma.user.update({
            where: { id: Number(session.user.id) },
            data: { name, image },
        });

        return res.status(200).json({ message: "Profile updated!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}