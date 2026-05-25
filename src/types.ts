export interface SoftwareHouse {
  id: string;
  name: string;
  website: string;
  logoUrl?: string;
  headquarters: string;
  cities: string[]; // e.g., ["Lahore", "Karachi", "Islamabad"]
  hrEmail: string;
  careerPortalUrl: string;
  recruitmentFormUrl?: string; // Optional Google Form or portal specific form link
  description: string;
  specialties: string[]; // e.g., ["Python", "AWS Cloud", "Fintech"]
  commonlyHiredRoles: string[]; // e.g., ["Python Engineer", "DevOps Engineer"]
  establishedYear: number;
  rating?: number;
  cultureSnippet?: string;
}

export interface MatchResult {
  softwareHouseId: string;
  ratingScore: number; // match rating 1 - 100
  reasoning: string;
  matchedRoles: string[];
  matchedLocations: string[];
  tailoredSubject: string;
  tailoredCoverLetter: string;
}

export interface CVAnalysisResult {
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  detectedSkills: string[];
  preferredLocation: string;
  suggestedRoles: string[];
  matches: MatchResult[];
  overallSummary: string;
}

export interface FilterCriteria {
  searchQuery: string;
  searchLocation: string;
  roleCategory: string;
  specialtyTag: string;
}
