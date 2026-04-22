import { PaymentSettings } from "@/components/dashboard/payment-settings";

export default function PaymentSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure default loan parameters for solar financing
        </p>
      </div>
      <PaymentSettings />
    </div>
  );
}