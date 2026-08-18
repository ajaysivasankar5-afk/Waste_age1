import { UserProfile } from "../types";

// Generic privacy-preserving sandbox roles for local testing without exposing any real personal data or user IDs
export const DEMO_USERS: UserProfile[] = [
  {
    id: "usr_sandbox_citizen",
    citizenId: "ECO-7829-PRIV",
    name: "Verified Eco Citizen",
    email: "citizen.eco@private.local",
    role: "Eco Citizen",
    avatar: "🌱",
    district: "Greenwood Sector 4",
    ecoPoints: 240,
    joinedDate: "August 2026",
    streakDays: 14,
    isPrivate: true,
  },
  {
    id: "usr_sandbox_inspector",
    citizenId: "INSP-4091-PRIV",
    name: "Municipal Waste Inspector",
    email: "inspector.lead@municipality.gov",
    role: "Municipal Inspector",
    avatar: "🛡️",
    district: "Metropolitan District",
    ecoPoints: 580,
    joinedDate: "January 2026",
    streakDays: 45,
    isPrivate: true,
  },
  {
    id: "usr_sandbox_volunteer",
    citizenId: "VOL-2105-PRIV",
    name: "Community Green Volunteer",
    email: "volunteer@zerowaste.org",
    role: "Green Volunteer",
    avatar: "🌿",
    district: "Bayside Eco Community",
    ecoPoints: 310,
    joinedDate: "June 2026",
    streakDays: 22,
    isPrivate: true,
  },
];
