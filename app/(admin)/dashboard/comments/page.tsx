import { prisma } from "@/lib/prisma";
import CommentsTable from "./components/CommentsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Frown,
  Angry,
  MessageCircle,
} from "lucide-react";

async function getComments() {
  return prisma.comment.findMany({
    where: { parentId: null },
    include: {
      blog: { select: { title: true, slug: true } },
      replies: {
        include: {
          admin: { select: { name: true } },
          reactions: true,
        },
        orderBy: { createdAt: "asc" },
      },
      reactions: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getReactionStats() {
  const stats = await prisma.commentReaction.groupBy({
    by: ["type"],
    _count: { type: true },
  });

  const totalComments = await prisma.comment.count({
    where: { parentId: null },
  });
  const totalReplies = await prisma.comment.count({
    where: { parentId: { not: null } },
  });

  return {
    reactions: stats.reduce(
      (acc, s) => ({ ...acc, [s.type]: s._count.type }),
      {} as Record<string, number>
    ),
    totalComments,
    totalReplies,
  };
}

const REACTION_CONFIG = {
  LIKE: { icon: ThumbsUp, label: "Suka", color: "text-blue-500" },
  DISLIKE: { icon: ThumbsDown, label: "Tidak Suka", color: "text-gray-500" },
  LOVE: { icon: Heart, label: "Love", color: "text-red-500" },
  LAUGH: { icon: Laugh, label: "Haha", color: "text-yellow-500" },
  SAD: { icon: Frown, label: "Sedih", color: "text-purple-500" },
  ANGRY: { icon: Angry, label: "Marah", color: "text-orange-500" },
};

export default async function CommentsPage() {
  const [comments, stats] = await Promise.all([
    getComments(),
    getReactionStats(),
  ]);

  const totalReactions = Object.values(stats.reactions).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kelola Komentar</h1>
        <p className="text-muted-foreground">
          Lihat dan balas komentar dari pengunjung blog
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Komentar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{stats.totalComments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.totalReplies}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{totalReactions}</span>
          </CardContent>
        </Card>
      </div>

      {/* Reaction Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Statistik Reactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(REACTION_CONFIG).map(
              ([type, { icon: Icon, label, color }]) => (
                <div
                  key={type}
                  className="flex flex-col items-center p-3 rounded-lg bg-muted"
                >
                  <Icon className={`w-6 h-6 ${color} mb-1`} />
                  <span className="text-xl font-bold">
                    {stats.reactions[type] || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <CommentsTable comments={comments} />
    </div>
  );
}
