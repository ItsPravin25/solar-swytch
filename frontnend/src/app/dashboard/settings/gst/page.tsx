import { GstSettings } from "@/components/dashboard/gst-settings";

export default function GstSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">GST Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure GST percentage and quotation settings
        </p>
      </div>
      <GstSettings />
    </div>
  );
}