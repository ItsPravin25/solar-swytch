import { Badge } from "@/components/ui/badge";

interface StatusChipProps {
  approved: boolean;
}

export function StatusChip({ approved }: StatusChipProps) {
  return (
    <Badge
      className={
        approved
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
      }
    >
      {approved ? "Approved" : "Pending"}
    </Badge>
  );
}
