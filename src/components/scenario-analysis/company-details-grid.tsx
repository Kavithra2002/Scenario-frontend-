"use client";

import { MetricCard } from "./metric-card";
import type { CompanyDetailsData } from "@/types/scenario-analysis";

interface CompanyDetailsGridProps {
  /** When backend is ready: pass data from API */
  data: CompanyDetailsData;
}

export function CompanyDetailsGrid({ data }: CompanyDetailsGridProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Company Details</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            changePercent={m.changePercent}
            changeLabel={m.changeLabel}
          />
        ))}
      </div>
    </div>
  );
}
