
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading?: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing your results...</CardTitle>
          <CardDescription>Please wait while we process your report.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Analysis Results</CardTitle>
        </div>
        <CardDescription>Generated on {new Date(result.date).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-muted-foreground">{result.summary}</p>
        </div>
        
        {result.insights.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Key Insights</h3>
            <ul className="list-disc pl-4 space-y-1">
              {result.insights.map((insight, index) => (
                <li key={index} className="text-muted-foreground">{insight}</li>
              ))}
            </ul>
          </div>
        )}
        
        {result.recommendations.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Recommendations</h3>
            <ul className="list-disc pl-4 space-y-1">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="text-muted-foreground">{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;
