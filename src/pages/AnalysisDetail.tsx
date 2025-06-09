import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MEDICAL_REPORT_ANALYSIS_LIST_ENDPOINT } from "@/configurations/api";

// Import the new component and the shared ReportAnalysisData interface
// Make sure ReportAnalysisData is correctly structured to match your AnalysisResult schema's main fields
import ReportResultsDisplay, { ReportAnalysisData } from '@/components/medical-reports/MedicalReportResultsDisplay';

const AnalysisDetail: React.FC = () => {
  const [reportAnalysis, setReportAnalysis] = useState<ReportAnalysisData | null>(null);
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
      setReportAnalysis(null);

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

        // --- SIMPLIFIED: Directly receive the structured data ---
        const data: ReportAnalysisData = await response.json();
        setReportAnalysis(data); // This 'data' is now directly what the frontend expects.
        // --- END SIMPLIFIED ---

      } catch (err: any) {
        console.error("Failed to fetch analysis details:", err);
        setError(err.message || "Failed to load analysis details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [reportId]);

  // Render Logic remains the same
  if (loading) return <div className="p-4 text-center">Loading analysis details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!reportAnalysis) {
    return <div className="p-4 text-muted-foreground">No detailed analysis available for this report.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ReportResultsDisplay reportAnalysis={reportAnalysis} />
    </div>
  );
};

export default AnalysisDetail;