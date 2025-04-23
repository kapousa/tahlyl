
import React, { useState } from "react";
import AnalysisForm from "@/components/analysis/AnalysisForm";
import AnalysisResults from "@/components/analysis/AnalysisResults";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalysisResult } from "@/types";

const AnalysisService: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setIsAnalyzing(false);
    setAnalysisResult(result);
  };

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
      
      <div className="space-y-8">
        <AnalysisForm 
          onAnalysisStart={() => setIsAnalyzing(true)}
          onAnalysisComplete={handleAnalysisComplete}
        />
        
        <AnalysisResults 
          result={analysisResult}
          isLoading={isAnalyzing}
        />
      </div>
    </div>
  );
};

export default AnalysisService;
