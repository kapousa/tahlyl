
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BloodTest } from '@/types';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface BloodTestCardProps {
  test: BloodTest;
}

const BloodTestCard: React.FC<BloodTestCardProps> = ({ test }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{test.name}</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">{formatDate(test.date)}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {test.metrics.slice(0, 3).map((metric, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{metric.name}</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${
                  metric.status === 'normal' ? 'text-foreground' : 
                  metric.status === 'high' ? 'text-health-danger' : 
                  metric.status === 'low' ? 'text-health-warning' : 'text-health-danger'
                }`}>
                  {metric.value} {metric.unit}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({metric.referenceRange.min}-{metric.referenceRange.max})
                </span>
              </div>
            </div>
          ))}
          {test.metrics.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{test.metrics.length - 3} more metrics
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/bloodtests/${test.id}`}>
            <FileText className="mr-2 h-4 w-4" />
            View Report
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/analysis?test=${test.id}`}>
            Analyze
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BloodTestCard;
