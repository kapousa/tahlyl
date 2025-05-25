import React, { useState, useEffect } from 'react';
import MedicalReportCard from '@/components/medical-reports/MedicalReportCard';
import { MEDICAL_REPORT_LIST_CARDS_ENDPOINT } from "@/configurations/api";
import { MedicalReportCardType } from '@/types'; // Import your updated type definition

// Helper function to derive overall status from metric statuses
// This function needs to be defined if you're deriving 'status' on the frontend
const deriveStatus = (metrics: any[]): MedicalReportCardType['status'] => {
  if (!metrics || metrics.length === 0) return "unknown";
  if (metrics.some((m) => m.status === "critical")) return "critical";
  // Ensure 'm.status' is checked before using 'includes'
  if (metrics.some((m) => ["high", "low", "abnormal"].includes(m.status || ''))) return "abnormal";
  if (metrics.every((m) => m.status === "normal")) return "normal";
  return "unknown";
};

/**
 * Helper function to parse metric values that can be:
 * 1. Simple strings/numbers (e.g., "1.13")
 * 2. The string "None"
 * 3. A string representing a Python dictionary (e.g., "{'first_hour': 38}")
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


const MedicalReportsPage: React.FC = () => {
  // State will now hold the normalized MedicalReportCardType[]
  const [reports, setReports] = useState<MedicalReportCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json(); // Parse response data here

        if (!response.ok) {
          let errorMessage = `HTTP error! Status: ${response.status}`;
          // Attempt to get more specific error from response body
          if (responseData && responseData.detail) {
            errorMessage = responseData.detail;
          } else if (response.statusText) {
            errorMessage = response.statusText;
          }
          throw new Error(errorMessage);
        }

        // Determine if 'data' or 'data.results' contains the reports
        let rawReportsArray: any[] = [];
        if (Array.isArray(responseData)) {
          rawReportsArray = responseData;
        } else if (responseData && Array.isArray(responseData.results)) {
          // If your API returns a structure like { count: 5, next: null, previous: null, results: [...] }
          rawReportsArray = responseData.results;
        } else {
          // Handle unexpected response format
          throw new Error("API response is not an array of reports or a recognized structure.");
        }

        // Normalize the fetched data to match MedicalReportCardType
        const normalizedReports: MedicalReportCardType[] = rawReportsArray.map((report: any) => {
          // Map metrics, applying filter for safety and transforming structure
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
                  // If no meaningful reference range data, return metric without the property
                  return metricBase;
                })
            : []; // Default to an empty array if metrics is not an array

          return {
            id: report.id,
            name: report.report_name, // Assuming report_name from your API response
            date: report.report_date, // Assuming report_date from your API response
            status: deriveStatus(transformedMetrics), // Derive overall status from normalized metrics
            metrics: transformedMetrics,
          };
        });

        setReports(normalizedReports);

      } catch (err: any) {
        console.error('Failed to fetch reports:', err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchReports();
  }, []); // Empty dependency array means this runs once on mount

  // --- Render based on loading/error states ---
  if (loading) {
    return <div className="text-center p-4">Loading medical reports...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  if (reports.length === 0) {
    return <div className="text-center p-4 text-gray-500">No medical reports available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reports.map((report) => (
        // Ensure report.id is unique and stable for keys
        <MedicalReportCard key={report.id} test={report} />
      ))}
    </div>
  );
};

export default MedicalReportsPage;