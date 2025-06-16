import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const quizzes = await prisma.quiz.findMany({ include: { questions: true } });

        return res.status(200).json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes.", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
