
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BloodTest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';

interface BloodTestDetailProps {
  test: BloodTest;
}

const BloodTestDetail: React.FC<BloodTestDetailProps> = ({ test }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getStatusBadge = () => {
    switch (test.status) {
      case 'normal':
        return <Badge variant="outline" className="bg-health-secondary/10 text-health-secondary border-health-secondary/20">Normal</Badge>;
      case 'abnormal':
        return <Badge variant="outline" className="bg-health-warning/10 text-health-warning border-health-warning/20">Abnormal</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-health-danger/10 text-health-danger border-health-danger/20">Critical</Badge>;
      default:
        return null;
    }
  };

  const getMetricStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-health-secondary';
      case 'high':
        return 'text-health-danger';
      case 'low':
        return 'text-health-warning';
      case 'critical':
        return 'text-health-danger font-bold';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{test.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Test Date: {formatDate(test.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-3">
          <div className="grid grid-cols-12 text-sm font-medium py-2 border-b">
            <div className="col-span-4">Test</div>
            <div className="col-span-2 text-right">Result</div>
            <div className="col-span-2 text-right">Units</div>
            <div className="col-span-3 text-right">Reference Range</div>
            <div className="col-span-1 text-right">Status</div>
          </div>
          
          {test.metrics.map((metric, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 text-sm py-2 border-b last:border-b-0"
            >
              <div className="col-span-4">{metric.name}</div>
              <div className={`col-span-2 text-right font-medium ${getMetricStatusClass(metric.status)}`}>
                {metric.value}
              </div>
              <div className="col-span-2 text-right text-muted-foreground">{metric.unit}</div>
              <div className="col-span-3 text-right text-muted-foreground">
                {metric.referenceRange.min} - {metric.referenceRange.max}
              </div>
              <div className="col-span-1 text-right">
                {metric.status === 'normal' ? (
                  <Badge variant="outline" className="bg-health-secondary/10 text-health-secondary border-health-secondary/20">
                    Normal
                  </Badge>
                ) : metric.status === 'high' ? (
                  <Badge variant="outline" className="bg-health-danger/10 text-health-danger border-health-danger/20">
                    High
                  </Badge>
                ) : metric.status === 'low' ? (
                  <Badge variant="outline" className="bg-health-warning/10 text-health-warning border-health-warning/20">
                    Low
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-health-danger/10 text-health-danger border-health-danger/20">
                    Critical
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodTestDetail;
