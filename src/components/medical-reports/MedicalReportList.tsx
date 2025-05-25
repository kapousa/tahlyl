// src/components/medical-reports/MedicalReportList.tsx
import React, { useEffect, useState } from "react";
import MedicalReportCard from "@/components/medical-reports/MedicalReportCard";
import { MedicalReportCardType } from "@/types"; // Ensure this path is correct
import { MEDICAL_REPORT_LIST_CARDS_ENDPOINT } from "@/configurations/api";

// Helper function to derive overall status from metric statuses
// Moved outside the component to avoid re-creation on every render
const deriveStatus = (metrics: any[]): MedicalReportCardType['status'] => {
  if (!metrics || metrics.length === 0) return "unknown";
  if (metrics.some((m) => m.status === "critical")) return "critical";
  // Ensure 'm.status' is checked before using 'includes' for safety
  if (metrics.some((m) => ["high", "low", "abnormal"].includes(m.status || ''))) return "abnormal";
  if (metrics.every((m) => m.status === "normal")) return "normal";
  return "unknown";
};

/**
 * Helper function to parse metric values that can be:
 * 1. Simple strings/numbers (e.g., "1.13")
 * 2. The string "None"
 * 3. A string representing a Python dictionary (e.g., "{'first_hour': 38}")
 * Moved outside the component to avoid re-creation on every render
 */
const parseMetricValue = (input: string | null | undefined): string | { [key: string]: any } => {
  if (typeof input !== 'string' || input === "None" || input.trim() === "") {
    return ""; // Return empty string for null, undefined, "None", or empty string inputs
  }
  // Check if the string looks like a Python dictionary
  if (input.startsWith("{'") && input.endsWith("'}") && input.includes(":")) {
    try {
      // Replace single quotes with double quotes for valid JSON parsing
      const jsonString = input.replace(/'/g, '"');
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn("Failed to parse Python dict string for metric:", input, e);
      // Fallback to returning the original string if parsing fails
      return input;
    }
  }
  return input; // Return the string as-is if it's not a dict string
};


const MedicalReportList: React.FC = () => {
  const [reports, setReports] = useState<MedicalReportCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      if (!token) {
        setError("Authentication token not found. Please log in.");
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
        // Your API response is directly an array (as per your comment)
        if (Array.isArray(responseData)) {
          reportsArray = responseData;
        } else if (responseData && Array.isArray(responseData.results)) {
            // Also handle paginated responses if applicable (like in MedicalReportsPage)
            reportsArray = responseData.results;
        }
        else {
          throw new Error("API response is not a direct array of reports or a recognized structure.");
        }

        const normalized = reportsArray.map((report: any) => {
          const transformedMetrics = Array.isArray(report.metrics) ? report.metrics
            .filter((m: any) => typeof m === 'object' && m !== null) // Filter out any null/undefined metrics
            .map((m: any) => {
              const minRange = parseMetricValue(m.reference_range_min);
              const maxRange = parseMetricValue(m.reference_range_max);

              const metricBase: Omit<MedicalReportCardType['metrics'][number], 'referenceRange'> = {
                name: m.name || '', // Default to empty string if name is missing
                value: parseMetricValue(m.value),
                unit: parseMetricValue(m.unit),
                status: (m.status || 'unknown') as MedicalReportCardType['status'], // Default to 'unknown'
              };

              // Conditionally add referenceRange only if there's actual data for it
              if (
                (typeof minRange === 'string' && minRange.trim() !== '') ||
                (typeof maxRange === 'string' && maxRange.trim() !== '') ||
                typeof minRange === 'object' || // If minRange is an object (e.g., parsed dict)
                typeof maxRange === 'object'    // If maxRange is an object (e.g., parsed dict)
              ) {
                 return {
                   ...metricBase,
                   referenceRange: {
                     min: minRange,
                     max: maxRange,
                   }
                 };
               }
               // Otherwise, return the metric without the referenceRange property
               return metricBase;
            }) : []; // Default to empty array if metrics is not an array

          return {
            id: report.id,
            name: report.report_name,
            date: report.report_date,
            status: deriveStatus(transformedMetrics), // Use transformed metrics to derive overall status
            metrics: transformedMetrics,
          };
        });

        setReports(normalized);
        setLoading(false);

      } catch (err: any) {
        console.error("Failed to fetch reports:", err);
        setError(err.message || "An unexpected error occurred while fetching reports.");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p className="text-center p-4">Loading reports...</p>;
  }

  if (error) {
    return <p className="text-center p-4 text-red-600">Error: {error}</p>;
  }

  if (reports.length === 0) {
    return <p className="text-center p-4 text-gray-500">No medical reports found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <MedicalReportCard key={report.id} test={report} />
      ))}
    </div>
  );
};

export default MedicalReportList;