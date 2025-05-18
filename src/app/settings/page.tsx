
import { SettingsManager } from "@/components/settings/SettingsManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";

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
    </div>
  );
}
