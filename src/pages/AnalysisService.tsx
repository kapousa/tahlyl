
import React from "react";
import AnalysisForm from "@/components/analysis/AnalysisForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AnalysisService: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link to="/analysis">
            <ChevronLeft className="mr-1 h-4 w-4" />
            All Services
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Analysis Service</h1>
      </div>
      
      <AnalysisForm />
    </div>
  );
};

export default AnalysisService;
