
import React from "react";
import { useParams } from "react-router-dom";
import { bloodTests } from "@/data/mockData";
import BloodTestDetail from "@/components/blood-tests/BloodTestDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BloodTestDetailPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const test = bloodTests.find((t) => t.id === testId);

  if (!test) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-2">Test not found</h2>
        <p className="text-muted-foreground mb-6">The requested blood test could not be found.</p>
        <Button asChild>
          <Link to="/bloodtests">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blood Tests
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link to="/bloodtests">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Blood Test Details</h1>
      </div>
      
      <BloodTestDetail test={test} />
      
      <div className="flex justify-end">
        <Button asChild>
          <Link to={`/analysis?test=${test.id}`}>
            Analyze This Test
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BloodTestDetailPage;
