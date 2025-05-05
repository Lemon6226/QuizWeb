import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuestionInput = {
    text: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    console.log("Session:", session);

    if (!session || !session.user?.email) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { title, questions }: { title: string; questions: QuestionInput[] } = req.body; // Define the type for the request body

        const quiz = await prisma.quiz.create({
            data: {
                title,
                userId: user.id,
                questions: {
                    create: questions.map((q: QuestionInput) => ({ text: q.text })),
                },
            },
        });

        return res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
