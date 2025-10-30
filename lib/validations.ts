/**
 * Zod validation schemas for forms and API routes
 */

import { z } from "zod";

/**
 * Malaysian phone number validation
 */
export const malaysianPhoneSchema = z
  .string()
  .regex(/^\+60\d{9,10}$/, "Invalid Malaysian phone number. Format: +60123456789")
  .or(
    z
      .string()
      .regex(/^0\d{9,10}$/, "Invalid phone number")
      .transform((val) => `+60${val.slice(1)}`)
  );

/**
 * Volunteer registration schema
 */
export const volunteerRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: malaysianPhoneSchema,
  whatsappNumber: malaysianPhoneSchema.optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  nationality: z.string().optional(),
  idNumber: z.string().optional(),

  // Address
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(1, "Please select your state"),
  postcode: z.string().optional(),

  // Emergency contact
  emergencyName: z.string().optional(),
  emergencyPhone: malaysianPhoneSchema.optional(),
  emergencyRelation: z.string().optional(),

  // Profile
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  availability: z.record(z.array(z.string())).optional(),
});

export type VolunteerRegistrationInput = z.infer<typeof volunteerRegistrationSchema>;

/**
 * Project creation schema
 */
export const projectCreationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["ONE_TIME", "RECURRING", "CAMPAIGN", "EMERGENCY"]),
  category: z.enum([
    "HOMELESS_CARE",
    "FOOD_DISTRIBUTION",
    "EDUCATION",
    "HEALTHCARE",
    "DISASTER_RELIEF",
    "FUNDRAISING",
    "ADMIN_SUPPORT",
    "EVENT_MANAGEMENT",
    "OTHER",
  ]),
  location: z.string().min(3, "Location is required"),
  state: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),

  // Dates
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),

  // Capacity
  volunteersNeeded: z.number().min(1, "At least 1 volunteer is required"),

  // Requirements
  minAge: z.number().min(16).max(100).optional(),
  requiredSkills: z.array(z.string()).optional(),
  physicalDemand: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  // Status
  status: z.enum(["DRAFT", "PUBLISHED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),

  // Media
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),

  // Gamification
  pointsReward: z.number().min(0).default(10),
  badgeReward: z.string().optional(),
});

export type ProjectCreationInput = z.infer<typeof projectCreationSchema>;

/**
 * Volunteer check-in schema
 */
export const checkInSchema = z.object({
  volunteerId: z.string().cuid(),
  projectId: z.string().cuid(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
  }),
  photoUrl: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

/**
 * Volunteer check-out schema
 */
export const checkOutSchema = z.object({
  attendanceId: z.string().cuid(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
  }),
  notes: z.string().max(500).optional(),
});

export type CheckOutInput = z.infer<typeof checkOutSchema>;

/**
 * Volunteer review schema
 */
export const volunteerReviewSchema = z.object({
  volunteerId: z.string().cuid(),
  projectId: z.string().cuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type VolunteerReviewInput = z.infer<typeof volunteerReviewSchema>;

/**
 * Connection request schema
 */
export const connectionRequestSchema = z.object({
  volunteerId: z.string().cuid(),
  connectedWithId: z.string().cuid(),
  message: z.string().max(500).optional(),
});

export type ConnectionRequestInput = z.infer<typeof connectionRequestSchema>;

/**
 * Email validation
 */
export const emailSchema = z.string().email();

/**
 * Password validation (for future authentication)
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * GPS coordinates validation
 */
export const gpsCoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  timestamp: z.coerce.date().optional(),
});

export type GPSCoordinates = z.infer<typeof gpsCoordinatesSchema>;

/**
 * File upload validation
 */
export const imageUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(["image/jpeg", "image/png", "image/webp"]),
});
