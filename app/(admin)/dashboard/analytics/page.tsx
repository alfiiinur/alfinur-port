import { prisma } from "@/lib/prisma";
import BlogAnalyticsChart from "./components/BlogAnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, TrendingUp, MessageCircle } from "lucide-react";

async function getStats() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      _count: {
        select: { views: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalViews = await prisma.blogView.count();
  const totalBlogs = await prisma.blog.count({ where: { published: true } });
  const totalComments = await prisma.comment.count({
    where: { parentId: null },
  });

  const blogStats = blogs.map((blog) => ({
    id: blog.id,
    title:
      blog.title.length > 25 ? blog.title.substring(0, 25) + "..." : blog.title,
    fullTitle: blog.title,
    slug: blog.slug,
    views: blog._count.views,
    comments: blog._count.comments,
  }));

  const topBlogs = [...blogStats]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return { totalViews, totalBlogs, totalComments, blogStats, topBlogs };
}

export default async function AnalyticsPage() {
  const stats = await getStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Statistik dan performa blog Anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.totalViews}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published Blogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.totalBlogs}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.totalComments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Views/Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold">
                {stats.totalBlogs > 0
                  ? Math.round(stats.totalViews / stats.totalBlogs)
                  : 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <BlogAnalyticsChart
        topBlogs={stats.topBlogs}
        allBlogs={stats.blogStats}
      />
    </div>
  );
}
