
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const HealthRecords: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Health Records</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg">Medical History</CardTitle>
            </div>
            <CardDescription>View your complete medical history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access and review your past medical records, diagnoses, and treatments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg">Prescriptions</CardTitle>
            </div>
            <CardDescription>Manage your prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View current and past prescriptions, including dosage and refill information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg">Immunizations</CardTitle>
            </div>
            <CardDescription>Track your immunization history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep track of your vaccinations and immunization schedule.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecords;
