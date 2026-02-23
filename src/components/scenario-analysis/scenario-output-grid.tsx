"use client";

import { MetricCard } from "./metric-card";
import type { ScenarioOutputData } from "@/types/scenario-analysis";

interface ScenarioOutputGridProps {
  /** When backend is ready: pass data from API */
  data: ScenarioOutputData;
}

export function ScenarioOutputGrid({ data }: ScenarioOutputGridProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Scenario Output</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            changePercent={m.changePercent}
            changeLabel={m.changeLabel}
            showChartIcon
          />
        ))}
      </div>
    </div>
  );
}
