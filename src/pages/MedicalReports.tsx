// src/pages/MedicalReportsPage.tsx
import React from 'react'; // React is still needed
import MedicalReportList from '@/components/medical-reports/MedicalReportList'; // <--- IMPORT MedicalReportList here!
// You no longer need to import MedicalReportCard directly on this page.
// You also no longer need MEDICAL_REPORT_LIST_CARDS_ENDPOINT, MedicalReportCardType,
// deriveStatus, or parseMetricValue here, as MedicalReportList handles them.

const MedicalReportsPage: React.FC = () => {
  // All fetching, loading, error, and search logic is now managed within MedicalReportList.
  // This page simply acts as a container for the comprehensive list.

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Medical Reports</h1>
      <MedicalReportList />
    </div>
  );
};

export default MedicalReportsPage;