import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No quotations yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create your first quotation to get started
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Quotation
        </Button>
      </CardContent>
    </Card>
  );
}
