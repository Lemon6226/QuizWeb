import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Retrieve session
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { quizId, points } = req.body;

    try {
        const score = await prisma.score.create({
            data: {
                userId: Number(session.user.id),
                quizId: Number(quizId),
                points: points,
                value: points,
            },
        });

        return res.status(201).json(score);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}