
import { AnalysisService, BloodTest, HealthMetric, User } from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  role: "patient",
  avatar: "/avatar.png"
};

export const healthMetrics: HealthMetric[] = [
  {
    id: "m1",
    name: "Hemoglobin",
    value: 14.2,
    unit: "g/dL",
    trend: "up",
    change: 0.3,
    status: "normal",
    history: [
      { date: "2023-01-15", value: 13.8 },
      { date: "2023-04-10", value: 13.9 },
      { date: "2023-07-22", value: 14.0 },
      { date: "2023-10-05", value: 14.2 }
    ]
  },
  {
    id: "m2",
    name: "Glucose",
    value: 105,
    unit: "mg/dL",
    trend: "down",
    change: 8,
    status: "normal",
    history: [
      { date: "2023-01-15", value: 118 },
      { date: "2023-04-10", value: 115 },
      { date: "2023-07-22", value: 110 },
      { date: "2023-10-05", value: 105 }
    ]
  },
  {
    id: "m3",
    name: "Cholesterol",
    value: 195,
    unit: "mg/dL",
    trend: "down",
    change: 15,
    status: "normal",
    history: [
      { date: "2023-01-15", value: 215 },
      { date: "2023-04-10", value: 210 },
      { date: "2023-07-22", value: 200 },
      { date: "2023-10-05", value: 195 }
    ]
  },
  {
    id: "m4",
    name: "Blood Pressure",
    value: 128,
    unit: "mmHg",
    trend: "stable",
    change: 0,
    status: "warning",
    history: [
      { date: "2023-01-15", value: 130 },
      { date: "2023-04-10", value: 129 },
      { date: "2023-07-22", value: 128 },
      { date: "2023-10-05", value: 128 }
    ]
  }
];

export const bloodTests: BloodTest[] = [
  {
    id: "bt1",
    date: "2023-10-05",
    name: "Complete Blood Count",
    metrics: [
      {
        name: "Hemoglobin",
        value: 14.2,
        unit: "g/dL",
        referenceRange: { min: 12.0, max: 15.5 },
        status: "normal"
      },
      {
        name: "White Blood Cells",
        value: 7.5,
        unit: "K/uL",
        referenceRange: { min: 4.5, max: 11.0 },
        status: "normal"
      },
      {
        name: "Platelets",
        value: 350,
        unit: "K/uL",
        referenceRange: { min: 150, max: 450 },
        status: "normal"
      }
    ],
    fileUrl: "/reports/cbc_oct_2023.pdf",
    status: "normal"
  },
  {
    id: "bt2",
    date: "2023-10-05",
    name: "Lipid Panel",
    metrics: [
      {
        name: "Total Cholesterol",
        value: 195,
        unit: "mg/dL",
        referenceRange: { min: 0, max: 200 },
        status: "normal"
      },
      {
        name: "HDL Cholesterol",
        value: 60,
        unit: "mg/dL",
        referenceRange: { min: 40, max: 100 },
        status: "normal"
      },
      {
        name: "LDL Cholesterol",
        value: 115,
        unit: "mg/dL",
        referenceRange: { min: 0, max: 100 },
        status: "high"
      },
      {
        name: "Triglycerides",
        value: 140,
        unit: "mg/dL",
        referenceRange: { min: 0, max: 150 },
        status: "normal"
      }
    ],
    fileUrl: "/reports/lipid_oct_2023.pdf",
    status: "abnormal"
  },
  {
    id: "bt3",
    date: "2023-07-22",
    name: "Metabolic Panel",
    metrics: [
      {
        name: "Glucose",
        value: 110,
        unit: "mg/dL",
        referenceRange: { min: 70, max: 99 },
        status: "high"
      },
      {
        name: "Creatinine",
        value: 0.9,
        unit: "mg/dL",
        referenceRange: { min: 0.6, max: 1.2 },
        status: "normal"
      },
      {
        name: "Calcium",
        value: 9.5,
        unit: "mg/dL",
        referenceRange: { min: 8.5, max: 10.5 },
        status: "normal"
      }
    ],
    fileUrl: "/reports/metabolic_jul_2023.pdf",
    status: "abnormal"
  },
  {
    id: "bt4",
    date: "2023-04-10",
    name: "Complete Blood Count",
    metrics: [
      {
        name: "Hemoglobin",
        value: 13.9,
        unit: "g/dL",
        referenceRange: { min: 12.0, max: 15.5 },
        status: "normal"
      },
      {
        name: "White Blood Cells",
        value: 7.2,
        unit: "K/uL",
        referenceRange: { min: 4.5, max: 11.0 },
        status: "normal"
      },
      {
        name: "Platelets",
        value: 320,
        unit: "K/uL",
        referenceRange: { min: 150, max: 450 },
        status: "normal"
      }
    ],
    fileUrl: "/reports/cbc_apr_2023.pdf",
    status: "normal"
  }
];

export const analysisServices: AnalysisService[] = [
  {
    id: "s1",
    name: "General Blood Test Analysis",
    description: "Comprehensive analysis of your complete blood count results.",
    icon: "file-text"
  },
  {
    id: "s2",
    name: "Liver Function Test Analysis",
    description: "Detailed evaluation of liver enzyme levels and function.",
    icon: "chart-line"
  },
  {
    id: "s3",
    name: "Lipid Profile Analysis",
    description: "Assessment of cholesterol levels and cardiovascular risk factors.",
    icon: "heart"
  },
  {
    id: "s4",
    name: "Metabolic Panel Analysis",
    description: "Analysis of your body's metabolism and organ function indicators.",
    icon: "user"
  }
];
