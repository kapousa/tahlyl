// src/components/medical-reports/RecentMedicalReports.tsx
import React, { useEffect, useState } from "react";
import MedicalReportCard from "@/components/medical-reports/MedicalReportCard";
import { MedicalReportCardType } from "@/types"; // Ensure this path is correct
import { MEDICAL_REPORT_LIST_CARDS_ENDPOINT } from "@/configurations/api";

// Helper function to derive overall status from metric statuses
// Moved outside the component to avoid re-creation on every render
const deriveStatus = (metrics: any[]): MedicalReportCardType['status'] => {
  if (!metrics || metrics.length === 0) return "unknown";
  if (metrics.some((m) => m.status === "critical")) return "critical";
  if (metrics.some((m) => ["high", "low", "abnormal"].includes(m.status || ''))) return "abnormal"; // Added || '' for safety
  if (metrics.every((m) => m.status === "normal")) return "normal";
  return "unknown";
};

const parseMetricValue = (input: string | null | undefined): string | { [key: string]: any } => {
  if (typeof input !== 'string' || input === "None" || input.trim() === "") {
    return ""; // Return empty string for null, undefined, "None", or empty string inputs
  }
  if (input.startsWith("{'") && input.endsWith("'}") && input.includes(":")) {
    try {
      const jsonString = input.replace(/'/g, '"');
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn("Failed to parse Python dict string for metric:", input, e);
      return input;
    }
  }
  return input;
};


const RecentMedicalReports: React.FC = () => {
  const [recentReports, setRecentReports] = useState<MedicalReportCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentReports = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${MEDICAL_REPORT_LIST_CARDS_ENDPOINT}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          let errorMessage = `HTTP error! Status: ${response.status}`;
          if (responseData && responseData.detail) {
            errorMessage = responseData.detail;
          } else if (responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0) {
            errorMessage = JSON.stringify(responseData);
          } else if (response.statusText) {
            errorMessage = response.statusText;
          }
          throw new Error(errorMessage);
        }

        let reportsArray: any[] = [];
        if (Array.isArray(responseData)) {
          reportsArray = responseData;
        } else if (responseData && Array.isArray(responseData.results)) {
          reportsArray = responseData.results;
        } else {
          throw new Error("API response is not an array of reports or a recognized structure.");
        }

        // Sort reports by date (most recent first) before taking the top 2
        const sortedReports = reportsArray.sort((a, b) =>
          new Date(b.report_date).getTime() - new Date(a.report_date).getTime()
        );

        const normalizedAndSliced = sortedReports.slice(0, 2).map((report: any) => {
          const transformedMetrics = Array.isArray(report.metrics)
            ? report.metrics
                .filter((m: any) => typeof m === 'object' && m !== null) // Filter out any null/undefined metrics
                .map((m: any) => {
                  const minRange = parseMetricValue(m.reference_range_min);
                  const maxRange = parseMetricValue(m.reference_range_max);

                  const metricBase: Omit<MedicalReportCardType['metrics'][number], 'referenceRange'> = {
                    name: m.name || '',
                    value: parseMetricValue(m.value),
                    unit: parseMetricValue(m.unit),
                    status: (m.status || 'unknown') as MedicalReportCardType['status'],
                  };

                  // Conditionally add referenceRange only if there's actual data for it
                  if (
                    (typeof minRange === 'string' && minRange.trim() !== '') ||
                    (typeof maxRange === 'string' && maxRange.trim() !== '') ||
                    typeof minRange === 'object' ||
                    typeof maxRange === 'object'
                  ) {
                    return {
                      ...metricBase,
                      referenceRange: {
                        min: minRange,
                        max: maxRange,
                      },
                    };
                  }
                  return metricBase;
                })
            : [];

          return {
            id: report.id,
            name: report.report_name,
            date: report.report_date,
            status: deriveStatus(transformedMetrics),
            metrics: transformedMetrics,
          };
        });

        setRecentReports(normalizedAndSliced);
        setLoading(false);

      } catch (err: any) {
        console.error("Failed to fetch recent reports:", err);
        setError(err.message || "An unexpected error occurred while fetching reports.");
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  if (loading) {
    return <p className="text-center p-4">Loading recent reports...</p>;
  }

  if (error) {
    return <p className="text-center p-4 text-red-600">Error: {error}</p>;
  }

  if (recentReports.length === 0) {
    return <p className="text-center p-4 text-gray-500">No recent medical reports found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {recentReports.map((report) => (
        <MedicalReportCard key={report.id} test={report} />
      ))}
    </div>
  );
};

export default RecentMedicalReports;