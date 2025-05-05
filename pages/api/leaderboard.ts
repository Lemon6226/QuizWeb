import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

type LeaderboardEntry = {
    userId: number;
    totalPoints: number;
    user: User | undefined;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LeaderboardEntry[] | { error: string }>
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

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

        const final: LeaderboardEntry[] = scores.map((s) => ({
            userId: s.userId,
            totalPoints: s._sum?.points || 0,
            user: users.find((u) => u.id === s.userId),
        }));

        return res.status(200).json(final);
    } catch (error) {
        console.error("Leaderboard error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
