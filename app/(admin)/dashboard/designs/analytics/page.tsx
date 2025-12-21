import { prisma } from "@/lib/prisma";
import { Heart, TrendingUp, Eye, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Design Analytics | Dashboard",
};

async function getDesignAnalytics() {
  const designs = await prisma.design.findMany({
    include: {
      _count: { select: { likes: true } },
      likes: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalLikes = designs.reduce((sum, d) => sum + d._count.likes, 0);
  const topDesigns = [...designs]
    .sort((a, b) => b._count.likes - a._count.likes)
    .slice(0, 10);

  // Get likes by date (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentLikes = await prisma.designLike.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    include: { design: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Group likes by date
  const likesByDate: Record<string, number> = {};
  recentLikes.forEach((like) => {
    const date = like.createdAt.toISOString().split("T")[0];
    likesByDate[date] = (likesByDate[date] || 0) + 1;
  });

  return { designs, totalLikes, topDesigns, recentLikes, likesByDate };
}

export default async function DesignAnalyticsPage() {
  const { designs, totalLikes, topDesigns, likesByDate } =
    await getDesignAnalytics();

  const stats = [
    {
      label: "Total Designs",
      value: designs.length,
      icon: Eye,
      color: "bg-blue-500",
    },
    {
      label: "Total Likes",
      value: totalLikes,
      icon: Heart,
      color: "bg-red-500",
    },
    {
      label: "Avg Likes/Design",
      value: designs.length > 0 ? (totalLikes / designs.length).toFixed(1) : 0,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "Likes (7 days)",
      value: Object.values(likesByDate).reduce((a, b) => a + b, 0),
      icon: Calendar,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Design Analytics</h1>
          <p className="text-muted-foreground">
            Track likes and engagement on your designs
          </p>
        </div>
        <Link
          href="/dashboard/designs"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Manage Designs
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl border bg-card flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Likes Chart (Simple Bar) */}
      <div className="p-6 rounded-xl border bg-card">
        <h2 className="text-lg font-semibold mb-4">Likes (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-40">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split("T")[0];
            const count = likesByDate[dateStr] || 0;
            const maxCount = Math.max(...Object.values(likesByDate), 1);
            const height = (count / maxCount) * 100;

            return (
              <div
                key={dateStr}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-primary/80 rounded-t-md transition-all"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("en", { weekday: "short" })}
                </span>
                <span className="text-xs font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Liked Designs */}
      <div className="p-6 rounded-xl border bg-card">
        <h2 className="text-lg font-semibold mb-4">Top Liked Designs</h2>
        <div className="space-y-3">
          {topDesigns.map((design, index) => (
            <div
              key={design.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-lg font-bold text-muted-foreground w-6">
                #{index + 1}
              </span>
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                {design.image ? (
                  <Image
                    src={design.image}
                    alt={design.title}
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{design.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {design.category}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-red-500">
                <Heart className="w-4 h-4 fill-current" />
                <span className="font-semibold">{design._count.likes}</span>
              </div>
            </div>
          ))}
          {topDesigns.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No designs yet. Create your first design!
            </p>
          )}
        </div>
      </div>

      {/* All Designs Table */}
      <div className="p-6 rounded-xl border bg-card">
        <h2 className="text-lg font-semibold mb-4">All Designs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Design</th>
                <th className="text-left py-3 px-4 font-medium">Category</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Likes</th>
                <th className="text-right py-3 px-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr
                  key={design.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        {design.image && (
                          <Image
                            src={design.image}
                            alt={design.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium truncate max-w-[200px]">
                        {design.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {design.category}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        design.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {design.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="flex items-center justify-end gap-1 text-red-500">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      {design._count.likes}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground text-sm">
                    {new Date(design.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
