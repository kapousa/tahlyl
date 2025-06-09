// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { healthMetrics } from "@/data/mockData";
import RecentMedicalReports from "@/components/medical-reports/RecentMedicalReports";
import HealthMetricCard from "@/components/dashboard/HealthMetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DIGITAL_PROFILE_VIEW_ENDPOINT } from "@/configurations/api";

const Dashboard: React.FC = () => {
  const [digitalProfile, setDigitalProfile] = useState(null);

  useEffect(() => {
    //const token = localStorage.getItem("token");
    //console.log("Token is:", token);
    //console.log("Endpoint is:", DIGITAL_PROFILE_VIEW_ENDPOINT); // 🔍 check this

    const fetchDigitalProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${DIGITAL_PROFILE_VIEW_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDigitalProfile(data);
        console.log("Digital Profile Data:", data);
      } catch (error) {
        console.error("Error fetching digital profile:", error);
      }
    };

    fetchDigitalProfile();
  }, []);

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

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="md:col-span-1 lg:col-span-1">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Medical Reports</h2>
          </div>
          <RecentMedicalReports />
        </div>

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

                {digitalProfile && (
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Fetched Digital Profile (Raw)</h4>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                      {JSON.stringify(digitalProfile, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;