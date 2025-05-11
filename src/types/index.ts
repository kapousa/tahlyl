
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
