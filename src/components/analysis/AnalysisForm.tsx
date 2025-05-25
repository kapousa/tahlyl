import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useParams } from 'react-router-dom';
import { AnalysisOption, AnalysisResult, AnalysisService } from '@/types';
import { Upload, Languages } from 'lucide-react';
import { ANALYSIS_SERVICE_VIEW_ENDPOINT, ANALYSIS_ANALYZE_ENDPOINT } from "@/configurations/api";

interface AnalysisFormProps {
  onAnalysisStart?: () => void;
  onAnalysisComplete?: (result: AnalysisResult) => void;
  analysisServiceEndpoint?: string;
  analysisEndpoint: string;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({
  onAnalysisStart,
  onAnalysisComplete,
  analysisServiceEndpoint = `${ANALYSIS_SERVICE_VIEW_ENDPOINT}`,
  analysisEndpoint = `${ANALYSIS_ANALYZE_ENDPOINT}`,
}) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<AnalysisService | null | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<AnalysisOption>({
    tone: "general",
    language: "english"
  });
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${analysisServiceEndpoint}/${serviceId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AnalysisService | null = await response.json();
        setService(data);
      } catch (e: any) {
        console.error("Could not fetch analysis services:", e);
        setError("Failed to load analysis services.");
      }
    };

    fetchServices();
  }, [serviceId, analysisServiceEndpoint]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onAnalysisStart?.();
    setAnalysisInProgress(true);
    setError(null);

    const formData = new FormData();
    formData.append("serviceId", serviceId || "");
    formData.append("tone", options.tone);
    formData.append("arabic", options.language === "arabic" ? "true" : "false");

    if (service?.name) {
        formData.append("report_type", service.name);
    }

    if (!selectedFile) {
      setError("Please upload a medical report.");
      setAnalysisInProgress(false);
      return;
    }
    formData.append("reportFile", selectedFile);

    try {
      const response = await fetch(analysisEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisInProgress(false);
      onAnalysisComplete?.(result);

    } catch (e: any) {
      console.error("Analysis request failed:", e);
      setError(e.message || "Failed to generate analysis.");
      setAnalysisInProgress(false);
    }
  };

  const handleToneChange = (value: string) => {
    setOptions(prev => ({ ...prev, tone: value as AnalysisOption['tone'] }));
  };

  const handleLanguageChange = (value: string) => {
    setOptions(prev => ({ ...prev, language: value as AnalysisOption['language'] }));
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-2 text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-2">Service not found</h2>
        <p className="text-muted-foreground">The requested analysis service could not be found.</p>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Select Medical Report</h3>

            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file-upload">Upload a new report:</Label>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <span className="text-sm">{selectedFile.name}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: PDF, JPG, PNG
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2. Choose Tone</h3>
            <RadioGroup
              defaultValue={options.tone}
              onValueChange={handleToneChange}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="general" id="tone-general" className="peer sr-only" />
                <Label
                  htmlFor="tone-general"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="mb-2 font-medium">General</span>
                  <span className="text-xs text-center">Simple explanation suitable for most people</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="doctor" id="tone-doctor" className="peer sr-only" />
                <Label
                  htmlFor="tone-doctor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="mb-2 font-medium">Doctor-focused</span>
                  <span className="text-xs text-center">Technical with medical terminology</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="educational" id="tone-educational" className="peer sr-only" />
                <Label
                  htmlFor="tone-educational"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="mb-2 font-medium">Educational</span>
                  <span className="text-xs text-center">Detailed explanations with helpful context</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">3. Select Language</h3>
            <RadioGroup
              defaultValue={options.language}
              onValueChange={handleLanguageChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="english" id="lang-english" className="peer sr-only" />
                <Label
                  htmlFor="lang-english"
                  className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Languages className="h-5 w-5" />
                  <span>English</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="arabic" id="lang-arabic" className="peer sr-only" />
                <Label
                  htmlFor="lang-arabic"
                  className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Languages className="h-5 w-5" />
                  <span>العربية (Arabic)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!selectedFile || analysisInProgress}
          >
            {analysisInProgress ? "Analyzing..." : "Generate Analysis"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AnalysisForm;