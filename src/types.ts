export type WasteCategory = "Recyclable" | "Organic" | "Hazardous" | "Landfill";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Eco Citizen" | "Municipal Inspector" | "Green Volunteer" | "Resident";
  avatar: string;
  district: string;
  ecoPoints: number;
  joinedDate: string;
  streakDays: number;
}

export interface WasteComponentBreakdown {
  part: string;
  material: string;
  binName: string;
  category: WasteCategory;
  action: string;
}

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  material: string;
  color: string;
  binName: string;
  instructions: string;
  tips: string;
  contaminationWarning: string;
  environmentalImpact: string;
  decompositionTime: string;
  preparationSteps: string[];
  confidence?: number;
  photoUrl?: string;
  timestamp?: number;
  region?: string;
  resinCode?: string;
  recyclingSymbol?: string;
  componentBreakdown?: WasteComponentBreakdown[];
  carbonSavedKg?: number;
  recycledProduct?: string;
  alternativeDisposal?: string;
  recyclabilityRating?: "100% Infinitely Recyclable" | "High Commercial Recyclability" | "Commercially Compostable" | "Hazardous / Specialized Recovery" | "Non-Recyclable Landfill Residual";
}

export interface RegionGuideline {
  id: string;
  name: string;
  flag: string;
  description: string;
  bins: {
    name: string;
    category: WasteCategory;
    color: string;
    bgClass: string;
    textClass: string;
    acceptedItems: string[];
    prohibitedItems: string[];
  }[];
  specialRules: string[];
  hotline?: string;
}

export interface WasteAuditEntry {
  id: string;
  itemName: string;
  category: WasteCategory;
  material: string;
  timestamp: number;
  photoUrl?: string;
  divertedFromLandfill: boolean;
  userId?: string;
}

export interface DumpingReport {
  id: string;
  title: string;
  location: string;
  category: "Illegal Dumping" | "Overflowing Public Bin" | "Hazardous Spill" | "Uncollected Waste";
  description: string;
  photoUrl?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Pending Investigation" | "Dispatched Cleanup" | "Resolved";
  timestamp: number;
  reporterName?: string;
}

export interface ScheduleEvent {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  time: string;
  binType: string;
  category: WasteCategory;
  color: string;
  active: boolean;
  notes?: string;
  frequency?: "Weekly" | "Bi-Weekly" | "Monthly";
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: "Myth Buster" | "Recycling Guide" | "Composting" | "Hazardous Safety" | "Zero Waste";
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaway: string;
  badge: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: WasteCategory | "Household" | "General";
  critical: boolean;
  tip?: string;
}

export interface WasteChecklistCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  category: WasteCategory | "Household";
  items: ChecklistItem[];
}

