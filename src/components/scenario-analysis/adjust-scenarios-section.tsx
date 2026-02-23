"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import type { ScenarioSummary } from "@/types/scenario-analysis";

interface AdjustScenariosSectionProps {
  /** When backend is ready: pass scenarios from API. Empty = show "No scenarios available" message */
  scenarios?: ScenarioSummary[];
  onAddScenario?: () => void;
}

export function AdjustScenariosSection({
  scenarios = [],
  onAddScenario,
}: AdjustScenariosSectionProps) {
  const hasScenarios = scenarios.length > 0;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Adjust Scenarios</h2>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          {hasScenarios ? (
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <span
                  key={s.id}
                  className="rounded-md border bg-muted/50 px-3 py-1.5 text-sm"
                >
                  {s.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <Settings className="size-12 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                No scenarios available. Add scenarios from Scenario Management page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
