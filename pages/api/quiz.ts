import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuestionInput = {
    text: string;
    options: string[];
    answer: string;
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

        if (!questions || questions.length === 0) {
            return res.status(400).json({ message: "Questions are required" });
        }

        const user = await prisma.user.findUnique({ where: { id: fallbackUserId } });
        if (!user) {
            return res.status(400).json({ message: `User with id ${fallbackUserId} not found.` });
        }

        const quiz = await prisma.quiz.create({
            data: {
                title,
                user: {
                    connect: { id: fallbackUserId }
                },
                questions: {
                    create: questions.map((q: QuestionInput) => ({
                        text: q.text,
                        options: q.options,
                        answer: q.answer,
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
