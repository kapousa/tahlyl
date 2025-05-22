
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisService } from '@/types';
import { Button } from '@/components/ui/button';
import { FileText, Heart, ChartLine, User, Syringe, ScanHeart, PillBottle, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnalysisServiceCardProps {
  service: AnalysisService;
}

const AnalysisServiceCard: React.FC<AnalysisServiceCardProps> = ({ service }) => {
  const getIcon = () => {
    switch (service.icon) {
      case 'scan-heart':
        return <ScanHeart className="h-10 w-10 text-health-primary" />;
      case 'heart':
        return <Heart className="h-10 w-10 text-health-primary" />;
      case 'pill-bottle':
        return <PillBottle className="h-10 w-10 text-health-primary" />;
      case 'syringe':
        return <Syringe className="h-10 w-10 text-health-primary" />;
      case 'brain':
        return <Brain className="h-10 w-10 text-health-primary" />;
      default:
        return <FileText className="h-10 w-10 text-health-primary" />;
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-center mb-3 bg-health-primary/5 p-3 rounded-lg w-16 h-16">
          {getIcon()}
        </div>
        <CardTitle className="text-lg">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{service.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/analysis/${service.id}`}>Select Service</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisServiceCard;
