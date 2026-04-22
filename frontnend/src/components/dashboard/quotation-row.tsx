import { Eye, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusChip } from "./status-chip";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import type { QuotationDetail } from "@/types/quotation";

interface QuotationRowProps {
  quotation: QuotationDetail;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function QuotationRow({
  quotation,
  onView,
  onDownload,
  onEdit,
}: QuotationRowProps) {
  const initials = `${quotation.firstName[0]}${quotation.lastName[0]}`.toUpperCase();
  const formattedDate = new Date(quotation.dateTime).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {quotation.firstName} {quotation.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{quotation.phone}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{quotation.systemCapacity}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {quotation.systemType.replace("-", " ")}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium">{quotation.amount}</span>
      </TableCell>
      <TableCell>
        <StatusChip approved={quotation.approved} />
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onView?.(quotation.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDownload?.(quotation.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit?.(quotation.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
