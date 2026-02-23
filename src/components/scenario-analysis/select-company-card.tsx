"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { CompanyOption } from "@/types/scenario-analysis";

interface SelectCompanyCardProps {
  /** When backend is ready: pass companies from API. Empty = "No companies available" */
  companies?: CompanyOption[];
  selectedCompanyId?: string | null;
  onSelectCompany?: (id: string) => void;
}

export function SelectCompanyCard({
  companies = [],
  selectedCompanyId,
  onSelectCompany,
}: SelectCompanyCardProps) {
  const hasCompanies = companies.length > 0;

  return (
    <Card className="py-3">
      <CardContent className="flex flex-col gap-2 px-4 py-0 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Select Company</span>
        </div>
        <select
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70 sm:max-w-xs"
          value={selectedCompanyId ?? ""}
          onChange={(e) => onSelectCompany?.(e.target.value)}
          disabled={!hasCompanies}
          aria-label="Select company"
        >
          <option value="">
            {hasCompanies ? "Select a company..." : "No companies available"}
          </option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
}
