// src/components/medical-reports/MedicalReportList.tsx
import React, { useEffect, useState, useMemo } from "react";
import MedicalReportCard from "@/components/medical-reports/MedicalReportCard";
import { MedicalReportCardType } from "@/types";
import { MEDICAL_REPORT_LIST_CARDS_ENDPOINT } from "@/configurations/api";
import { Input } from "@/components/ui/input"; // Import Input component
import { Button } from "@/components/ui/button"; // Import Button for clear functionality

// Helper function to derive overall status from metric statuses
const deriveStatus = (metrics: any[]): MedicalReportCardType['status'] => {
  if (!metrics || metrics.length === 0) return "unknown";
  if (metrics.some((m) => m.status === "critical")) return "critical";
  if (metrics.some((m) => ["high", "low", "abnormal"].includes(m.status || ''))) return "abnormal";
  if (metrics.every((m) => m.status === "normal")) return "normal";
  return "unknown";
};

const parseMetricValue = (input: string | null | undefined): string | { [key: string]: any } => {
  if (typeof input !== 'string' || input === "None" || input.trim() === "") {
    return "";
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

const MedicalReportList: React.FC = () => {
  const [reports, setReports] = useState<MedicalReportCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

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
        if (Array.isArray(responseData)) {
          reportsArray = responseData;
        } else if (responseData && Array.isArray(responseData.results)) {
          reportsArray = responseData.results;
        } else {
          throw new Error("API response is not a direct array of reports or a recognized structure.");
        }

        const normalized = reportsArray.map((report: any) => {
          const transformedMetrics = Array.isArray(report.metrics) ? report.metrics
            .filter((m: any) => typeof m === 'object' && m !== null)
            .map((m: any) => {
              const minRange = parseMetricValue(m.reference_range_min);
              const maxRange = parseMetricValue(m.reference_range_max);

              const metricBase: Omit<MedicalReportCardType['metrics'][number], 'referenceRange'> = {
                name: m.name || '',
                value: parseMetricValue(m.value),
                unit: parseMetricValue(m.unit),
                status: (m.status || 'unknown') as MedicalReportCardType['status'],
              };

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
                   }
                 };
               }
               return metricBase;
            }) : [];

          return {
            id: report.id,
            name: report.report_name,
            date: report.report_date,
            status: deriveStatus(transformedMetrics),
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

  // Memoize the filtered reports to avoid unnecessary re-calculations
  const filteredReports = useMemo(() => {
    if (!searchQuery) {
      return reports; // If no search query, return all reports
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return reports.filter(report =>
      report.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [reports, searchQuery]);

  if (loading) {
    return <p className="text-center p-4">Loading reports...</p>;
  }

  if (error) {
    return <p className="text-center p-4 text-red-600">Error: {error}</p>;
  }

  return (
    <div className="space-y-6"> {/* Wrapper div for search and grid */}
      <div className="flex items-center gap-2 mb-4 justify-end"> {/* Container for search input and clear button */}
        <Input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow max-w-sm" // Allow input to grow, but limit max width
        />
        {searchQuery && ( // Conditionally render clear button if query exists
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Conditional rendering for no results / no reports */}
      {filteredReports.length === 0 && searchQuery !== "" ? (
        <p className="text-center p-4 text-gray-500">No reports found matching "{searchQuery}".</p>
      ) : filteredReports.length === 0 && searchQuery === "" ? (
        <p className="text-center p-4 text-gray-500">No medical reports found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <MedicalReportCard key={report.id} test={report} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalReportList;