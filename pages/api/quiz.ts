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
    console.log("Session:", session);

    if (!session || !session.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, questions } = req.body;

    try {
        const quiz = await prisma.quiz.create({
            data: {
                title,
                userId: Number(session.user.id), // Convert ID to number
                questions: {
                    create: questions.map((q) => ({ text: q.text })),
                },
            },
        });

        return res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
