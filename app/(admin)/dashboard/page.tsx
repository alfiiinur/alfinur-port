import { prisma } from "@/lib/prisma";
import {
  FolderKanban,
  FileText,
  Palette,
  Eye,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DashboardCharts from "./components/DashboardCharts";

async function getStats() {
  const [
    projectCount,
    blogCount,
    designCount,
    publishedProjects,
    publishedBlogs,
    publishedDesigns,
    totalViews,
    totalComments,
    totalReactions,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.blog.count(),
    prisma.design.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.blog.count({ where: { published: true } }),
    prisma.design.count({ where: { published: true } }),
    prisma.blogView.count(),
    prisma.comment.count({ where: { parentId: null } }),
    prisma.commentReaction.count(),
  ]);

  return {
    projectCount,
    blogCount,
    designCount,
    publishedProjects,
    publishedBlogs,
    publishedDesigns,
    totalViews,
    totalComments,
    totalReactions,
  };
}

async function getRecentItems() {
  const [recentProjects, recentBlogs, recentDesigns] = await Promise.all([
    prisma.project.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.blog.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.design.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return { recentProjects, recentBlogs, recentDesigns };
}

async function getChartData() {
  // Content distribution
  const contentData = await Promise.all([
    prisma.project.count({ where: { published: true } }),
    prisma.blog.count({ where: { published: true } }),
    prisma.design.count({ where: { published: true } }),
  ]);

  // Top blogs by views
  const topBlogs = await prisma.blog.findMany({
    where: { published: true },
    select: {
      title: true,
      _count: { select: { views: true, comments: true } },
    },
    orderBy: { views: { _count: "desc" } },
    take: 5,
  });

  // Reaction stats
  const reactionStats = await prisma.commentReaction.groupBy({
    by: ["type"],
    _count: { type: true },
  });

  return {
    contentDistribution: [
      { name: "Projects", value: contentData[0], color: "#3b82f6" },
      { name: "Blogs", value: contentData[1], color: "#10b981" },
      { name: "Designs", value: contentData[2], color: "#f59e0b" },
    ],
    topBlogs: topBlogs.map((b) => ({
      name: b.title.length > 20 ? b.title.substring(0, 20) + "..." : b.title,
      views: b._count.views,
      comments: b._count.comments,
    })),
    reactionStats: reactionStats.map((r) => ({
      name: r.type,
      value: r._count.type,
    })),
  };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const { recentProjects, recentBlogs, recentDesigns } = await getRecentItems();
  const chartData = await getChartData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Projects"
          value={stats.projectCount}
          icon={FolderKanban}
          description={`${stats.publishedProjects} published`}
        />
        <StatsCard
          title="Blogs"
          value={stats.blogCount}
          icon={FileText}
          description={`${stats.publishedBlogs} published`}
        />
        <StatsCard
          title="Designs"
          value={stats.designCount}
          icon={Palette}
          description={`${stats.publishedDesigns} published`}
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          description="Unique visitors"
        />
        <StatsCard
          title="Comments"
          value={stats.totalComments}
          icon={MessageCircle}
          description="User comments"
        />
        <StatsCard
          title="Reactions"
          value={stats.totalReactions}
          icon={ThumbsUp}
          description="Total reactions"
        />
      </div>

      {/* Charts */}
      <DashboardCharts
        contentDistribution={chartData.contentDistribution}
        topBlogs={chartData.topBlogs}
        reactionStats={chartData.reactionStats}
      />

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Projects</CardTitle>
            <Link
              href="/dashboard/projects"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet</p>
            ) : (
              <ul className="space-y-3">
                {recentProjects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm truncate">{project.title}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        project.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Blogs</CardTitle>
            <Link
              href="/dashboard/blogs"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blogs yet</p>
            ) : (
              <ul className="space-y-3">
                {recentBlogs.map((blog) => (
                  <li
                    key={blog.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm truncate">{blog.title}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        blog.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Designs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Designs</CardTitle>
            <Link
              href="/dashboard/designs"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentDesigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No designs yet</p>
            ) : (
              <ul className="space-y-3">
                {recentDesigns.map((design) => (
                  <li
                    key={design.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm truncate">{design.title}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        design.published
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {design.published ? "Published" : "Draft"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
