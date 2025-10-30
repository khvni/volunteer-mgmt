import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { volunteerRegistrationSchema } from "@/lib/validations";
import { calculateTier, calculatePoints } from "@/lib/gamification";

/**
 * GET /api/volunteers
 * List volunteers with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";
    const tier = searchParams.get("tier") || "";
    const state = searchParams.get("state") || "";

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {
      status: "ACTIVE",
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tier) {
      where.tier = tier;
    }

    if (state) {
      where.state = state;
    }

    // Fetch volunteers with pagination
    const [volunteers, total] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { totalHours: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          photoUrl: true,
          city: true,
          state: true,
          tier: true,
          totalHours: true,
          points: true,
          skills: true,
          interests: true,
          verified: true,
          createdAt: true,
        },
      }),
      prisma.volunteer.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: volunteers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch volunteers",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/volunteers
 * Register a new volunteer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = volunteerRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: validationResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check for existing volunteer with same email or phone
    const existingVolunteer = await prisma.volunteer.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingVolunteer) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DUPLICATE_VOLUNTEER",
            message: "A volunteer with this email or phone number already exists",
          },
        },
        { status: 409 }
      );
    }

    // Create volunteer
    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationality: data.nationality,
        idNumber: data.idNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
        emergencyRelation: data.emergencyRelation,
        bio: data.bio,
        skills: data.skills,
        languages: data.languages,
        interests: data.interests,
        availability: data.availability,
        tier: "BRONZE",
        totalHours: 0,
        points: 0,
        status: "ACTIVE",
        verified: false,
        source: "website",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: volunteer,
        message: "Volunteer registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CREATE_ERROR",
          message: "Failed to register volunteer",
        },
      },
      { status: 500 }
    );
  }
}
