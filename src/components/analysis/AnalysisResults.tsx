import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AnalysisResult } from '@/types';
import { format } from 'date-fns';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const formatDate = (date: string | Date | null | undefined) => {
    if (date) {
      try {
        const parsedDate = new Date(date);
        return format(parsedDate, 'MMMM d, yyyy h:mm a'); // Example format
      } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
      }
    }
    return 'Not Available';
  };

  const renderDetailedResultsInBoxes = () => {
    if (!result?.detailed_results || Object.keys(result.detailed_results).length === 0) {
      return <p className="text-muted-foreground">No detailed results available.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(result.detailed_results).map(([key, detail]) => {
          if (typeof detail === 'object' && detail !== null && 'value' in detail) {
            const value = detail.value;
            const unit = detail.unit || '';
            const normalRange = detail.normal_range || '-';
            const status = detail.status || 'normal';

            let statusTextColor = 'text-green-500'; // Default to normal
            if (status === 'high') statusTextColor = 'text-red-500';
            if (status === 'low') statusTextColor = 'text-yellow-500';

            return (
              <div key={key} className="p-4 rounded-md shadow-sm bg-white dark:bg-gray-800">
                <h4 className="font-semibold mb-2">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</h4>
                <p className={`text-lg font-bold ${statusTextColor}`}>{value} {unit}</p>
                {normalRange !== '-' && <p className="text-sm text-gray-500 dark:text-gray-400">Normal: {normalRange}</p>}
                {status !== 'normal' && (
                  <p className={`text-sm font-semibold ${statusTextColor}`}>({status.charAt(0).toUpperCase() + status.slice(1)})</p>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="space-y-6">
        {result?.date && (
          <div className="mb-4">
            <h3 className="font-medium mb-1">Analysis Date</h3>
            <p className="text-muted-foreground">{formatDate(result.date)}</p>
          </div>
        )}

        {result?.summary && (
          <div>
            <h3 className="font-medium mb-2">Summary</h3>
            <p className="text-muted-foreground">{result.summary}</p>
          </div>
        )}

        {result?.detailed_results && Object.keys(result.detailed_results).length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Detailed Results</h3>
            {renderDetailedResultsInBoxes()}
          </div>
        )}

        {result?.interpretation && (
          <div>
            <h3 className="font-medium mb-2">Interpretation</h3>
            <p className="text-muted-foreground">{result.interpretation}</p>
          </div>
        )}

        {result?.recommendations && Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Recommendations</h3>
            <ul className="list-disc pl-4 space-y-1">
              {result.recommendations.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {result?.recommendations && typeof result.recommendations === 'string' && (
          <div>
            <h3 className="font-medium mb-2">Recommendations</h3>
            <p className="text-muted-foreground">{result.recommendations}</p>
          </div>
        )}

        {Object.keys(result || {})
          .filter(key => !['id', 'bloodTestId', 'serviceId', 'date', 'options', 'summary', 'detailed_results', 'interpretation', 'recommendations'].includes(key) && result?.[key] !== null && result?.[key] !== undefined)
          .map(key => (
            <div key={key}>
              <h3 className="font-medium mb-2">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</h3>
              {typeof result[key] === 'string' || typeof result[key] === 'number' ? (
                <p className="text-muted-foreground">{result[key]}</p>
              ) : (
                <pre className="text-xs text-muted-foreground">{JSON.stringify(result[key], null, 2)}</pre>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;