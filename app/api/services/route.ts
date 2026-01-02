import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      icon,
      price,
      priceType,
      currency,
      features,
      category,
      isPopular,
      isActive,
      showPrice,
      sortOrder,
    } = body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        icon: icon || "code",
        price,
        priceType: priceType || "FIXED",
        currency: currency || "IDR",
        features: features || [],
        category,
        isPopular: isPopular || false,
        isActive: isActive !== false,
        showPrice: showPrice !== false,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
