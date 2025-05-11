import React, { useState, useEffect } from "react";
import AnalysisServiceCard from "@/components/analysis/AnalysisServiceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ANALYSIS_SERVICES_ENDPOINT } from "@/configurations/api";

const Analysis: React.FC = () => {
  const [analysisServices, setAnalysisServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${ANALYSIS_SERVICES_ENDPOINT}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalysisServices(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching services:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading analysis services...</div>;
  }

  if (error) {
    return <div>Error loading analysis services: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Analysis Services</h1>
        <p className="text-muted-foreground">
          Select a service to analyze your blood test results and gain valuable insights
        </p>
      </div>
      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="how-it-works">
          <AccordionTrigger className="text-sm font-medium text-primary-600 hover:underline">
            Learn how it works
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</div>
                <div>
                  <p className="font-medium">Select an analysis service</p>
                  <p className="text-sm text-muted-foreground">Choose the type of analysis that best fits your needs</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</div>
                <div>
                  <p className="font-medium">Upload your blood test report</p>
                  <p className="text-sm text-muted-foreground">Either select from your existing reports or upload a new one</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</div>
                <div>
                  <p className="font-medium">Choose language and tone</p>
                  <p className="text-sm text-muted-foreground">Select your preferred language and the level of detail</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</div>
                <div>
                  <p className="font-medium">Receive personalized analysis</p>
                  <p className="text-sm text-muted-foreground">Get detailed insights and recommendations based on your results</p>
                </div>
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analysisServices.map((service) => (
          <AnalysisServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Analysis;