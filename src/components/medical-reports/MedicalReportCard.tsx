// src/components/medical-reports/MedicalReportCard.tsx
import React from 'react';
import { MedicalReportCardType } from '@/types';
import { Button } from '@/components/ui/button'; // Adjust path if necessary
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MedicalReportCardProps {
  test: MedicalReportCardType;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Use 'en-US' for locale if that's your target display format
    // Ensure date is valid before formatting
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  } catch (e) {
    console.error("Failed to format date:", dateString, e);
    return dateString;
  }
};

const getStatusBadge = (status: MedicalReportCardType['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'normal': return 'secondary';
    case 'high':
    case 'low':
    case 'abnormal': return 'destructive';
    case 'critical': return 'destructive';
    case 'unknown':
    case 'not available':
    default: return 'outline';
  }
};

const renderValue = (value: string | { [key: string]: any }): string => {
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value)
      .map(([key, val]) => `${key.replace(/_/g, ' ')}: ${val}`)
      .join(', ');
  }
  // If it's a string, ensure "None" is displayed as empty or N/A
  if (value === "None" || value === null || value === undefined || (typeof value === 'string' && value.trim() === "")) {
    return ""; // or "N/A" if you prefer
  }
  return value;
};

const MedicalReportCard: React.FC<MedicalReportCardProps> = ({ test }) => {
  if (!test) {
    console.warn("MedicalReportCard received an undefined 'test' prop.");
    return null;
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{test.name}</CardTitle>
        <CardDescription>{formatDate(test.date)}</CardDescription>
        <Badge variant={getStatusBadge(test.status)} className="mt-2 w-fit">
          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        {test.metrics && test.metrics.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {test.metrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-start text-sm">
                <span className="font-semibold flex-shrink-0 pr-2">{metric.name} </span>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 text-right flex-wrap justify-end">
                  <span
                    className={`font-medium ${metric.status === 'normal'
                        ? 'text-health-secondary'
                        : metric.status === 'high' || metric.status === 'critical'
                          ? 'text-red-600'
                          : metric.status === 'low'
                            ? 'text-orange-500'
                            : 'text-gray-500'
                      }`}
                  >
                    {renderValue(metric.value)} {renderValue(metric.unit)}
                  </span>
                  {metric.referenceRange ? (
                    <span className="text-xs text-muted-foreground text-wrap break-words min-w-0">
                      (
                      {renderValue(metric.referenceRange.min)}
                      {(renderValue(metric.referenceRange.min) && renderValue(metric.referenceRange.max)) ? ' - ' : ''}
                      {renderValue(metric.referenceRange.max)}
                      )
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground text-wrap break-words min-w-0">(N/A)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No detailed metrics available for this report.</p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2"> {/* Removed justify-between here */}
        {/* Added flex-grow and w-1/2 for consistent sizing across screens */}
        <Button variant="outline" className="flex-grow w-1/2">Details</Button>
        <Button variant="outline" className="flex-grow w-1/2">Analysis</Button>
      </CardFooter>
    </Card>
  );
};

export default MedicalReportCard;