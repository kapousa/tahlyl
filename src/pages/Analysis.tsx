import React, { useState, useEffect } from "react";
import AnalysisServiceCard from "@/components/analysis/AnalysisServiceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ANALYSIS_SERVICES_ENDPOINT } from "@/configurations/api";

interface AnalysisService {
  id: string;
  name: string;
  description: string;
  // Add other properties of your service object if needed
}

const Analysis: React.FC = () => {
  const [analysisServices, setAnalysisServices] = useState<AnalysisService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${ANALYSIS_SERVICES_ENDPOINT}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AnalysisService[] = await response.json();
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

  const filteredServices = analysisServices.filter((service) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(lowerCaseQuery) ||
      service.description.toLowerCase().includes(lowerCaseQuery)
    );
  });

  if (loading) {
    return <div>Loading analysis services...</div>;
  }

  if (error) {
    return <div>Error loading analysis services: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Container for Heading and Search Input */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Analysis Services</h1>
          <p className="text-muted-foreground">
            Select a service to analyze your medical report results and gain valuable insights
          </p>
        </div>

        {/* Search Input on the right */}
        <div className="w-full md:w-auto"> {/* Take full width on small screens, auto on medium/large */}
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm" // Full width within its container, max-width for control
          />
        </div>
      </div>
      {/* End Container for Heading and Search Input */}

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
                  <p className="font-medium">Upload your medical report</p>
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
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <AnalysisServiceCard key={service.id} service={service} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No services found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;