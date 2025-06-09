// src/components/reports/ReportResultsDisplay.tsx
import React, { useState } from 'react';

// Assuming these interfaces are either defined here or imported from a central types file
interface AnalysisDetailedResultItem {
  value?: string | number | boolean | Record<string, any>;
  unit?: string;
  normal_range?: string | Record<string, string>;
  status?: string;
}

interface AnalysisResult { // Matches your backend AnalysisResult Pydantic schema
  // --- NEW: Add report_name field here ---
  report_name?: string;

  summary?: string | Record<string, any> | any[];
  lifestyle_changes?: string | Record<string, any> | any[];
  diet_routine?: string | Record<string, any> | any[];
  key_findings?: string | Record<string, any> | any[];
  potential_impact?: string | Record<string, any> | any[];
  recommendations?: string | Record<string, any> | any[];
  detailed_analysis?: string | Record<string, any> | any[];
  potential_causes?: string | Record<string, any> | any[];
  next_steps?: string | Record<string, any> | any[];
  disclaimer?: string | Record<string, any> | any[];
  result_explanations?: string | Record<string, any> | any[];
  reference_ranges?: string | Record<string, any> | any[];
  potential_implications?: string | Record<string, any> | any[];
  wellness_assessment?: string | Record<string, any> | any[];
  preventative_recommendations?: string | Record<string, any> | any[];
  long_term_outlook?: string | Record<string, any> | any[];
  detailed_lab_values?: string | Record<string, any> | any[];
  scientific_references?: string | Record<string, any> | any[];
  pathophysiological_explanations?: string | Record<string, any> | any[];
  personal_summary?: string | Record<string, any> | any[];
  emotional_support?: string | Record<string, any> | any[];
  individualized_recommendations?: string | Record<string, any> | any[];
  date?: string;
  detailed_results?: Record<string, AnalysisDetailedResultItem>;
  doctor_questions?: Record<string, AnalysisDetailedResultItem>;
}

export interface ReportAnalysisData extends AnalysisResult {}

interface ProcessedMetricForDisplay {
  name: string;
  value: number;
  unit: string;
  normal_range: string;
  status: string;
}

// Helper to convert snake_case to Title Case
const formatTitle = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

const renderContent = (content: string | Record<string, any> | any[]): React.ReactNode => {
    if (typeof content === 'string') {
        return <p className="text-lg text-gray-600 leading-relaxed">{content}</p>;
    } else if (Array.isArray(content)) {
        return (
            <ul className="list-disc pl-5 text-lg text-gray-600 leading-relaxed">
                {content.map((item, index) => (
                    <li key={index}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
                ))}
            </ul>
        );
    } else if (typeof content === 'object' && content !== null) {
        if (Object.values(content).some(val => typeof val === 'object' && 'value' in val && 'status' in val)) {
             return (
                <div className="space-y-2">
                    {Object.entries(content).map(([key, item]) => (
                        <div key={key} className="border-l-4 border-blue-400 pl-3">
                            <h4 className="font-semibold text-md text-gray-700">{formatTitle(key)}:</h4>
                            {item.value && <p className="text-gray-600">Value: {typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}</p>}
                            {item.unit && <p className="text-gray-600">Unit: {item.unit}</p>}
                            {item.normal_range && <p className="text-gray-600">Normal Range: {typeof item.normal_range === 'object' ? JSON.stringify(item.normal_range) : item.normal_range}</p>}
                             {item.status && <p className="text-gray-600">Status: <span className={`font-bold ${
                                item.status === 'normal' ? 'text-green-600' :
                                item.status === 'high' || item.status === 'critical' || item.status === 'abnormal' ? 'text-red-600' :
                                item.status === 'low' ? 'text-orange-500' :
                                'text-gray-500'
                            }`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></p>}
                        </div>
                    ))}
                </div>
            );
        }
        return <pre className="bg-gray-100 p-3 rounded text-sm text-gray-700 overflow-x-auto">{JSON.stringify(content, null, 2)}</pre>;
    }
    return <p className="text-muted-foreground">Content not available or not in a displayable format.</p>;
};


const ReportResultsDisplay: React.FC<ReportResultsDisplayProps> = ({ reportAnalysis }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const allMetricsForDisplay: ProcessedMetricForDisplay[] = reportAnalysis.detailed_results
    ? Object.entries(reportAnalysis.detailed_results).map(([name, details]) => ({
        name,
        value: typeof details.value === 'number' ? details.value : parseFloat(details.value as string || '0'),
        unit: details.unit || '',
        normal_range: typeof details.normal_range === 'string' ? details.normal_range : JSON.stringify(details.normal_range || ''),
        status: details.status || 'unknown',
      }))
    : [];

  const filteredMetrics = allMetricsForDisplay.filter(metric => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      metric.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      metric.value.toString().toLowerCase().includes(lowerCaseSearchTerm) ||
      metric.unit.toLowerCase().includes(lowerCaseSearchTerm) ||
      metric.normal_range.toLowerCase().includes(lowerCaseSearchTerm) ||
      metric.status.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const excludedFields = new Set([
    'report_name', // --- NEW: Exclude report_name from dynamic rendering ---
    'summary',
    'detailed_results',
    'recommendations',
    'potential_implications',
    'date',
    'id'
  ]);

  const dynamicSections = Object.entries(reportAnalysis).filter(([key, value]) => {
    const isValuePresent = value !== null && value !== undefined &&
                           (typeof value === 'string' ? value.trim() !== '' : true) &&
                           (Array.isArray(value) ? value.length > 0 : true) &&
                           (typeof value === 'object' && value !== null ? Object.keys(value).length > 0 : true);

    return isValuePresent && !excludedFields.has(key);
  });

  return (
    <div className="space-y-8">
      {/* --- NEW: Display Report Name in the main heading --- */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {reportAnalysis.report_name ? `${reportAnalysis.report_name} Analysis` : 'Medical Report Analysis'}
      </h1>

      {/* Section 1: Analysis Summary */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Analysis Summary</h2>
        {reportAnalysis.summary && typeof reportAnalysis.summary === 'string' && reportAnalysis.summary.trim() !== '' ? (
          <p className="text-lg text-gray-600 leading-relaxed">{reportAnalysis.summary}</p>
        ) : (
          <p className="text-muted-foreground">No summary available for this report.</p>
        )}
      </section>

      {/* Section 2: Detailed Metrics */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Detailed Metrics</h2>
        <input
          type="text"
          placeholder="Search metrics by name, value, or status..."
          className="border p-2 mb-6 w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredMetrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetrics.map((metric: ProcessedMetricForDisplay) => (
              <div key={metric.name} className="border p-5 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{metric.name}</h3>
                <p className="text-base text-gray-700">
                  Value: <span className="font-medium">{metric.value} {metric.unit}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Normal Range: <span className="font-light">{metric.normal_range}</span>
                </p>
                <p className="text-base mt-2">
                  Status: <span className={`font-bold ${
                    metric.status === 'normal' ? 'text-green-600' :
                    metric.status === 'high' || metric.status === 'critical' || metric.status === 'abnormal' ? 'text-red-600' :
                    metric.status === 'low' ? 'text-orange-500' :
                    'text-gray-500'
                  }`}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No metrics available for this report or matching your search criteria.</p>
        )}
      </section>

      {/* Section for Recommendations (Explicitly handled) */}
      {reportAnalysis.recommendations && typeof reportAnalysis.recommendations === 'string' && reportAnalysis.recommendations.trim() !== '' && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Recommendations</h2>
          {renderContent(reportAnalysis.recommendations)}
        </section>
      )}

      {/* Section for Associated Risks (Explicitly handled, mapped from potential_implications) */}
      {reportAnalysis.potential_implications && typeof reportAnalysis.potential_implications === 'string' && reportAnalysis.potential_implications.trim() !== '' && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Associated Risks</h2>
          {renderContent(reportAnalysis.potential_implications)}
        </section>
      )}

      {/* Dynamically generated sections */}
      {dynamicSections.map(([key, value]) => (
        <section key={key} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">{formatTitle(key)}</h2>
          {renderContent(value)}
        </section>
      ))}

      {/* Attention Points placeholder (only if no other content is present) */}
      {dynamicSections.length === 0 && !reportAnalysis.summary && !reportAnalysis.detailed_results &&
       !reportAnalysis.recommendations && !reportAnalysis.potential_implications && (
        <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Attention Points</h2>
            <p className="text-muted-foreground">
                Specific "Attention Points" are not available in the current API response.
            </p>
        </section>
      )}
    </div>
  );
};

export default ReportResultsDisplay;