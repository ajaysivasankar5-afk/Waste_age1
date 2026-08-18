export type WasteCategory = "Recyclable" | "Organic" | "Hazardous" | "Landfill";

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
