"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuotationRow } from "./quotation-row";
import { Pagination } from "./pagination";
import { EmptyState } from "./empty-state";
import type { QuotationDetail } from "@/types/quotation";

interface QuotationsTableProps {
  quotations: QuotationDetail[];
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onEdit?: (id: string) => void;
}

type FilterType = "all" | "approved" | "pending";
const ITEMS_PER_PAGE = 10;

export function QuotationsTable({
  quotations,
  onView,
  onDownload,
  onEdit,
}: QuotationsTableProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredQuotations = useMemo(() => {
    if (filter === "all") return quotations;
    if (filter === "approved") return quotations.filter((q) => q.approved);
    return quotations.filter((q) => !q.approved);
  }, [filter, quotations]);

  const totalPages = Math.ceil(filteredQuotations.length / ITEMS_PER_PAGE);
  const paginatedQuotations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuotations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuotations, currentPage]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (quotations.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-base font-semibold">
            Recent Quotations
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            <div className="flex rounded-lg border bg-muted p-1">
              {(["all", "approved", "pending"] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                    filter === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>System</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedQuotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No quotations found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedQuotations.map((quotation) => (
                <QuotationRow
                  key={quotation.id}
                  quotation={quotation}
                  onView={onView}
                  onDownload={onDownload}
                  onEdit={onEdit}
                />
              ))
            )}
          </TableBody>
        </Table>
        {filteredQuotations.length > ITEMS_PER_PAGE && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
