
export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "provider";
  avatar?: string;
}

export interface BloodTest {
  id: string;
  date: string;
  name: string;
  metrics: BloodMetric[];
  fileUrl: string;
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

export interface AnalysisResult {
  id: string;
  bloodTestId: string;
  serviceId: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  date: string;
  options: AnalysisOption;
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
