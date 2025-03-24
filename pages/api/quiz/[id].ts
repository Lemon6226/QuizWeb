import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(id) },
            include: { questions: true },
        });

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        return res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
