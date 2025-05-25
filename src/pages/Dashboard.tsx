// src/pages/Dashboard.tsx
import React from "react";
import { healthMetrics } from "@/data/mockData"; // Keep if healthMetrics is still used
import RecentMedicalReports from "@/components/medical-reports/RecentMedicalReports"; // Import the new component
// Removed: import MedicalReportList from "@/components/medical-reports/MedicalReportList"; // No longer needed here
import HealthMetricCard from "@/components/dashboard/HealthMetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Health Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {healthMetrics.map((metric) => (
            <HealthMetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2"> {/* This div occupies 2 columns */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Medical Reports</h2>
          </div>
          {/* This component will now correctly display only the two most recent reports */}
          <RecentMedicalReports />

          {/* This is the Health Summary Card */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>Your overall health status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Cholesterol Level</p>
                      <p className="text-sm text-health-secondary">Normal</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-health-secondary" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Your cholesterol level has improved by 8% since your last check.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Blood Sugar</p>
                      <p className="text-sm text-health-warning">Slightly Elevated</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-health-warning" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Your blood sugar is slightly elevated. Consider reducing sugar intake.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Blood Pressure</p>
                      <p className="text-sm text-health-warning">Borderline</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 rounded-full bg-health-warning" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Your blood pressure is at the higher end of the normal range.</p>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start text-sm text-muted-foreground">
                        <span className="mr-2">•</span>
                        <span>Continue with low cholesterol diet</span>
                      </li>
                      <li className="flex items-start text-sm text-muted-foreground">
                        <span className="mr-2">•</span>
                        <span>Monitor blood sugar levels daily</span>
                      </li>
                      <li className="flex items-start text-sm text-muted-foreground">
                        <span className="mr-2">•</span>
                        <span>Schedule follow-up with Dr. Wilson</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* This div is now empty, effectively removing the full list of reports */}
        <div className="lg:col-span-1">
          {/* If you want to add other dashboard widgets here, this is the place! */}
          {/* For example, a link to the full reports page: */}
          {/* <h3 className="text-xl font-semibold mb-3">All Reports</h3>
          <p className="text-muted-foreground">View your complete medical history.</p>
          <button className="mt-2 p-2 bg-blue-500 text-white rounded">Go to All Reports</button> */}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;