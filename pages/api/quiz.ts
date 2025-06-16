import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuestionInput = {
    text: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {

        const fallbackUserId = 1;

        const { title, questions }: { title: string; questions: QuestionInput[] } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!questions) {
            return res.status(400).json({ message: "Questions are required" });
        }

        const quiz = await prisma.quiz.create({
            data: {
                title,
                userId: fallbackUserId,
                questions: {
                    create: questions.map((q) => ({
                        text: q.text,
                    })),
                },
            },
        });

        return res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
