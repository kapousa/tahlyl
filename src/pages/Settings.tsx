
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>Customize your application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="appName" className="text-sm font-medium">App Name</label>
              <Input id="appName" defaultValue="Tahlyl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">App Logo</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <SettingsIcon className="h-8 w-8 text-gray-400" />
                </div>
                <Button variant="outline">Upload New Logo</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">Light</Button>
                <Button variant="outline" className="flex-1">Dark</Button>
                <Button variant="outline" className="flex-1">System</Button>
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
