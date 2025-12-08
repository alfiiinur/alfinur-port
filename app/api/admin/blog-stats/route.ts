import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all blogs with view counts
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        _count: {
          select: { views: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get total stats
    const totalViews = await prisma.blogView.count();
    const totalBlogs = await prisma.blog.count();
    const publishedBlogs = await prisma.blog.count({
      where: { published: true },
    });

    // Get views per day for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const viewsPerDay = await prisma.blogView.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { id: true },
    });

    // Format blogs for chart
    const blogStats = blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      published: blog.published,
      views: blog._count.views,
      comments: blog._count.comments,
      createdAt: blog.createdAt,
    }));

    // Sort by views for top blogs
    const topBlogs = [...blogStats]
      .filter((b) => b.published)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return NextResponse.json({
      totalViews,
      totalBlogs,
      publishedBlogs,
      blogStats,
      topBlogs,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
