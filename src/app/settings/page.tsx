
import { SettingsManager } from "@/components/settings/SettingsManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SlidersHorizontal, Palette, Bell } from "lucide-react";
import { ToastSettingsManager } from "@/components/settings/ToastSettingsManager";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            <CardTitle>Game Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your game data and preferences here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsManager />
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>
            Choose which types of toast notifications to display.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToastSettingsManager />
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-primary" />
            <CardTitle>Theme Settings</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred application theme.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-4">
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
