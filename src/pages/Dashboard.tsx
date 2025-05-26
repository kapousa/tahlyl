// src/pages/Dashboard.tsx
import React from "react";
import { healthMetrics } from "@/data/mockData";
import RecentMedicalReports from "@/components/medical-reports/RecentMedicalReports";
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

      {/* MODIFIED SECTION: Recent Medical Reports and Health Summary consistently side-by-side */}
      {/* The grid is now explicitly set to 2 columns for all screen sizes (md and above) */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Recent Medical Reports - Occupies the first column */}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Medical Reports</h2>
          </div>
          <RecentMedicalReports />
        </div>

        {/* Health Summary Card - Occupies the second column */}
        <div className="md:col-span-1 lg:col-span-1">
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

        {/* Removed the empty lg:col-span-1 div, as it's no longer needed for a 2-column layout */}
      </section>
    </div>
  );
};

export default Dashboard;