/**
 * Gamification utilities for volunteer tier and points calculation
 */

import { VolunteerTier } from "@prisma/client";

export interface TierInfo {
  tier: VolunteerTier;
  minHours: number;
  minPoints: number;
  color: string;
  icon: string;
  benefits: string[];
}

export const TIER_REQUIREMENTS: Record<VolunteerTier, TierInfo> = {
  BRONZE: {
    tier: "BRONZE",
    minHours: 0,
    minPoints: 0,
    color: "#CD7F32",
    icon: "🥉",
    benefits: ["Basic volunteer access", "Join projects", "Earn badges"],
  },
  SILVER: {
    tier: "SILVER",
    minHours: 50,
    minPoints: 500,
    color: "#C0C0C0",
    icon: "🥈",
    benefits: [
      "All Bronze benefits",
      "Priority project notifications",
      "Connect with other volunteers",
    ],
  },
  GOLD: {
    tier: "GOLD",
    minHours: 150,
    minPoints: 1500,
    color: "#FFD700",
    icon: "🥇",
    benefits: [
      "All Silver benefits",
      "Certificate of appreciation",
      "Volunteer showcase feature",
      "Exclusive project access",
    ],
  },
  PLATINUM: {
    tier: "PLATINUM",
    minHours: 500,
    minPoints: 5000,
    color: "#E5E4E2",
    icon: "💎",
    benefits: [
      "All Gold benefits",
      "Leadership opportunities",
      "Mentor new volunteers",
      "VIP event invitations",
    ],
  },
  DIAMOND: {
    tier: "DIAMOND",
    minHours: 1000,
    minPoints: 10000,
    color: "#B9F2FF",
    icon: "👑",
    benefits: [
      "All Platinum benefits",
      "Exclusive Diamond events",
      "Global volunteer network",
      "MyFundAction ambassador status",
      "Professional development opportunities",
    ],
  },
};

/**
 * Calculate volunteer tier based on hours worked
 */
export function calculateTier(hours: number): VolunteerTier {
  if (hours >= 1000) return "DIAMOND";
  if (hours >= 500) return "PLATINUM";
  if (hours >= 150) return "GOLD";
  if (hours >= 50) return "SILVER";
  return "BRONZE";
}

/**
 * Calculate points from hours (10 points = 1 hour)
 */
export function calculatePoints(hours: number): number {
  return Math.floor(hours * 10);
}

/**
 * Get hours needed to reach next tier
 */
export function getHoursToNextTier(
  currentHours: number,
  currentTier: VolunteerTier
): { nextTier: VolunteerTier | null; hoursNeeded: number } {
  const tiers: VolunteerTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
  const currentIndex = tiers.indexOf(currentTier);

  if (currentIndex === tiers.length - 1) {
    return { nextTier: null, hoursNeeded: 0 }; // Already at max tier
  }

  const nextTier = tiers[currentIndex + 1];
  const nextTierRequirement = TIER_REQUIREMENTS[nextTier].minHours;
  const hoursNeeded = Math.max(0, nextTierRequirement - currentHours);

  return { nextTier, hoursNeeded };
}

/**
 * Get tier progress percentage
 */
export function getTierProgress(hours: number, currentTier: VolunteerTier): number {
  const { nextTier, hoursNeeded } = getHoursToNextTier(hours, currentTier);

  if (!nextTier) return 100; // Max tier reached

  const currentTierHours = TIER_REQUIREMENTS[currentTier].minHours;
  const nextTierHours = TIER_REQUIREMENTS[nextTier].minHours;
  const tierRange = nextTierHours - currentTierHours;
  const hoursInCurrentTier = hours - currentTierHours;

  return Math.min(100, (hoursInCurrentTier / tierRange) * 100);
}

/**
 * Badge requirements checker
 */
export interface BadgeRequirement {
  type: "hours" | "projects" | "skills" | "leadership" | "special";
  value: number | string;
  condition?: string;
}

export function checkBadgeRequirement(
  requirement: BadgeRequirement,
  volunteerData: {
    hours: number;
    projectsCompleted: number;
    skills: string[];
    teamsLed: number;
  }
): boolean {
  switch (requirement.type) {
    case "hours":
      return volunteerData.hours >= (requirement.value as number);
    case "projects":
      return volunteerData.projectsCompleted >= (requirement.value as number);
    case "skills":
      return volunteerData.skills.includes(requirement.value as string);
    case "leadership":
      return volunteerData.teamsLed >= (requirement.value as number);
    case "special":
      // Special badges require custom logic
      return false;
    default:
      return false;
  }
}

/**
 * Format hours display
 */
export function formatHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours.toFixed(1)}h`;
}

/**
 * Get tier color class for Tailwind
 */
export function getTierColorClass(tier: VolunteerTier): string {
  const colorMap: Record<VolunteerTier, string> = {
    BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
    SILVER: "bg-slate-100 text-slate-800 border-slate-300",
    GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
    PLATINUM: "bg-gray-100 text-gray-800 border-gray-300",
    DIAMOND: "bg-blue-100 text-blue-800 border-blue-300",
  };
  return colorMap[tier];
}
