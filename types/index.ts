/**
 * Shared TypeScript type definitions
 */

import { Prisma } from "@prisma/client";

/**
 * Volunteer with relations
 */
export type VolunteerWithRelations = Prisma.VolunteerGetPayload<{
  include: {
    badges: true;
    achievements: true;
    assignments: {
      include: {
        project: true;
      };
    };
  };
}>;

/**
 * Project with relations
 */
export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    assignments: {
      include: {
        volunteer: true;
      };
    };
    createdBy: true;
  };
}>;

/**
 * Volunteer assignment with relations
 */
export type AssignmentWithRelations = Prisma.VolunteerAssignmentGetPayload<{
  include: {
    volunteer: true;
    project: true;
  };
}>;

/**
 * Address type (shared across all projects)
 */
export interface Address {
  street?: string;
  city: string;
  state: string;
  postcode?: string;
  country: string;
}

/**
 * Contact information type
 */
export interface Contact {
  phone: string;
  email?: string;
  whatsappNumber?: string;
  preferredContact: "phone" | "email" | "whatsapp";
}

/**
 * Geo location type
 */
export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}

/**
 * Audit log type
 */
export interface AuditLog {
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

/**
 * Volunteer statistics
 */
export interface VolunteerStats {
  totalHours: number;
  totalProjects: number;
  points: number;
  tier: string;
  badges: number;
  achievements: number;
  connections: number;
  rank?: number;
}

/**
 * Project statistics
 */
export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalVolunteers: number;
  averageVolunteersPerProject: number;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  volunteerId: string;
  name: string;
  tier: string;
  hours: number;
  points: number;
  projects: number;
  photoUrl?: string;
}

/**
 * Notification type
 */
export interface Notification {
  id: string;
  type: "project_update" | "tier_upgrade" | "badge_earned" | "connection_request" | "hours_approved";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
  volunteers: {
    total: number;
    active: number;
    newThisMonth: number;
    tierDistribution: Record<string, number>;
  };
  projects: {
    total: number;
    active: number;
    completedThisMonth: number;
    upcomingThisWeek: number;
  };
  hours: {
    totalHours: number;
    averagePerVolunteer: number;
    thisMonth: number;
    thisWeek: number;
  };
  engagement: {
    averageHoursPerProject: number;
    volunteerRetentionRate: number;
    projectCompletionRate: number;
  };
}

/**
 * Filter options for volunteers
 */
export interface VolunteerFilters {
  search?: string;
  tier?: string[];
  skills?: string[];
  state?: string[];
  status?: string[];
  minHours?: number;
  maxHours?: number;
}

/**
 * Filter options for projects
 */
export interface ProjectFilters {
  search?: string;
  type?: string[];
  category?: string[];
  state?: string[];
  status?: string[];
  startDate?: Date;
  endDate?: Date;
  priority?: string[];
  availableOnly?: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

/**
 * Malaysian states
 */
export const MALAYSIAN_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Penang",
  "Perak",
  "Perlis",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
] as const;

export type MalaysianState = (typeof MALAYSIAN_STATES)[number];

/**
 * Skills list
 */
export const VOLUNTEER_SKILLS = [
  "Event Management",
  "First Aid",
  "Teaching",
  "Driving License",
  "Cooking",
  "Translation",
  "Photography",
  "Videography",
  "Graphic Design",
  "Social Media",
  "Fundraising",
  "Counseling",
  "Medical",
  "Engineering",
  "IT Support",
  "Administration",
] as const;

export type VolunteerSkill = (typeof VOLUNTEER_SKILLS)[number];

/**
 * Interests list
 */
export const VOLUNTEER_INTERESTS = [
  "Homeless Care",
  "Food Distribution",
  "Education",
  "Healthcare",
  "Disaster Relief",
  "Fundraising",
  "Event Management",
  "Administration",
  "Youth Programs",
  "Elderly Care",
  "Environmental",
  "Animal Welfare",
] as const;

export type VolunteerInterest = (typeof VOLUNTEER_INTERESTS)[number];
