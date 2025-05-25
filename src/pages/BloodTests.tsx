
import React from "react";
import { bloodTests } from "@/data/mockData";
import BloodTestCard from "@/components/dashboard/BloodTestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const BloodTests: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-muted/40 border-dashed border-muted">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Upload New Medical Report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
          <p className="mb-4 text-sm text-muted-foreground text-center">
            Upload your latest medical report results to keep track of your health
          </p>
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-lg cursor-pointer bg-background hover:bg-muted/30">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-1 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF, PNG, or JPG</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Medical Reports</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tests..."
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
          
          <Select defaultValue="date-desc">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bloodTests.map((test) => (
          <BloodTestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
};

export default BloodTests;
