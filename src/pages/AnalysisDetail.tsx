import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MEDICAL_REPORT_ANALYSIS_LIST_ENDPOINT } from "@/configurations/api";

// Import the default export (ReportResultsDisplay) and the named export (AnalysisResult)
import ReportResultsDisplay, { AnalysisResult } from '@/components/medical-reports/MedicalReportResultsDisplay';

const AnalysisDetail: React.FC = () => {
  // The state should now be an array of AnalysisResult
  const [reportAnalyses, setReportAnalyses] = useState<AnalysisResult[]>([]);
  const { reportId } = useParams<{ reportId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setError("No report ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchAnalysisData = async () => {
      setLoading(true);
      setError(null);
      setReportAnalyses([]); // Clear previous analyses on new fetch

      const token = localStorage.getItem('token');

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = MEDICAL_REPORT_ANALYSIS_LIST_ENDPOINT(reportId);
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // 'data' is already an array of AnalysisResult as per your backend
        const data: AnalysisResult[] = await response.json();
        setReportAnalyses(data); // Set the state with the array

      } catch (err: any) {
        console.error("Failed to fetch analysis details:", err);
        setError(err.message || "Failed to load analysis details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [reportId]);

  // Render Logic
  if (loading) return <div className="p-4 text-center">Loading analysis details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  // Pass the 'reportAnalyses' state directly to the ReportResultsDisplay component
  return (
    <div className="container mx-auto p-4">
      {/* Check if reportAnalyses array is not empty before rendering */}
      {reportAnalyses.length > 0 ? (
        <ReportResultsDisplay reportAnalyses={reportAnalyses} />
      ) : (
        <div className="text-center py-8 text-gray-500">No analysis results found for this report.</div>
      )}
    </div>
  );
};

export default AnalysisDetail;