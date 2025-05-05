import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getSession({ req });

    if (!session || !session.user?.email) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const quizzes = await prisma.quiz.findMany({
            where: { userId: user.id },
            include: { questions: true },
        });

        return res.status(200).json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
