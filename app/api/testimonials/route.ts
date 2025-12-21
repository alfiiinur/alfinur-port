import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      role,
      company,
      avatar,
      content,
      rating,
      projectType,
      isActive,
      isFeatured,
      sortOrder,
    } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        company,
        avatar,
        content,
        rating: rating || 5,
        projectType,
        isActive: isActive !== false,
        isFeatured: isFeatured || false,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
