// pages/api/leaderboard.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const scores = await prisma.score.groupBy({
            by: ["userId"],
            _sum: { points: true },
            orderBy: { _sum: { points: "desc" } },
        });

        const userIds = scores.map((s) => s.userId);
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
        });

        const final = scores.map((s) => ({
            userId: s.userId,
            totalPoints: s._sum?.points || 0,
            user: users.find((u) => u.id === s.userId),
        }));

        return res.status(200).json(final);
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}