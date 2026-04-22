import { TechnicalSettings } from "@/components/dashboard/technical-settings";

export default function TechnicalSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Technical Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage solar panel types and specifications
        </p>
      </div>
      <TechnicalSettings />
    </div>
  );
}