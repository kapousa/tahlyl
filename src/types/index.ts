
export interface User { // Backend updated
  id: string;
  name: string;
  email: string;
  password: string;
  role: "patient" | "provider";
  avatar?: string;
}

export interface BloodTest {
  id: string;
  added_datetime: string;
  name: string;
  metrics: BloodMetric[]; 
  status: "normal" | "abnormal" | "critical";
}

export interface BloodMetric {
  name: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: "normal" | "high" | "low" | "critical";
}

export interface MedicalReport {
  id: string;
  added_datetime: string;
  name: string;
  metrics: BloodMetric[]; 
  status: "normal" | "abnormal" | "critical";
}

// src/types/index.ts

export interface MedicalReportCardType {
  id: string | number;
  report_name: string;
  report_date: string;
  status: string;
  metrics: {
    name: string;
    value: string | { [key: string]: any }; // Allow object or string
    unit: string | { [key: string]: any };  // Allow object or string
    status: string;
    // Make referenceRange optional, as some metrics might not have it
    referenceRange?: {
      min: string | { [key: string]: any }; // Allow object or string
      max: string | { [key: string]: any }; // Allow object or string
    };
  }[];
}

export interface Metric {
  id: string;
  name?: string;
  value?: string;
  unit?: string;
  reference_range_min?: string; 
  reference_range_max?: string;
  status?: string;
  result_id: string;
  created_by?: string;
  created_date?: string;
  updated_by?: string;
  updated_date?: string;
};

export interface MedicalReportMetric {
  name: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: "normal" | "high" | "low" | "critical";
}

export interface AnalysisService {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AnalysisOption {
  tone: "general" | "doctor" | "educational";
  language: "english" | "arabic";
}

export interface AnalysisDetailedResult {
  value: number | string | { first_hour?: number; second_hour?: number } | Record<string, any>; // Be more specific if needed
  unit?: string;
  normal_range?: string | { first_hour?: string; second_hour?: string };
  status?: 'high' | 'normal' | 'low' | string; // Include other potential strings
}

export interface AnalysisResult {
  id: string;
  bloodTestId: string;
  serviceId: string;
  summary?: string;
  detailed_results?: Record<string, AnalysisDetailedResult | AnalysisDetailedResult[]>;
  potential_implications?: string[] | string;
  next_steps?: string[] | string;
  insights?: string[]; // Consider if these should also have status/range
  recommendations?: string[];
  date: string;
  options: AnalysisOption;
  [key: string]: any; // Allow for other dynamic keys from the JSON
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  status: "normal" | "warning" | "critical";
  history: {
    date: string;
    value: number;
  }[];
}

// src/pages/AnalysisDetailPage.tsx or a types file
// (You might want to define these in a separate types file for better organization, e.g., src/types/analysis.ts)

// Matches the structure of an individual metric within "detailed_results"
interface DetailedMetric {
  value: number;
  unit: string;
  normal_range: string; // The backend now provides this as a string, e.g., "Up to 200 mg/dL"
  status: string;
}

// Matches the overall structure of the API response
interface ReportAnalysisData {
  summary: string;
  detailed_results: { // This is an object where keys are metric names (e.g., "Total Cholesterol")
    [key: string]: DetailedMetric; // Each value is a DetailedMetric object
  };
  risk_assessment: string; // This is the text for risks
  recommendations: string; // This is the text for recommendations
  // Note: 'attention_points' is not in your current API response, so we won't add it yet.
}

// For rendering metrics (combines the key and value from detailed_results)
interface ProcessedMetricForDisplay {
  name: string;
  value: number;
  unit: string;
  normal_range: string;
  status: string;
  // If you want to split normal_range into min/max again:
  // reference_range_min: string;
  // reference_range_max: string;
}