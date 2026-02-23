"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Star } from "lucide-react";
import { SelectCompanyCard } from "@/components/scenario-analysis";
import type { CompanyOption, ScenarioSummary } from "@/types/scenario-analysis";

export interface ScenarioManagementContentProps {
  /** When backend is ready: pass companies from API. Empty = "No companies available" */
  companies?: CompanyOption[];
  /** When backend is ready: pass existing scenarios from API */
  existingScenarios?: ScenarioSummary[];
  /** When backend is ready: pass recommended scenarios from API */
  recommendedScenarios?: ScenarioSummary[];
  selectedCompanyId?: string | null;
  onSelectCompany?: (id: string) => void;
}

export function ScenarioManagementContent({
  companies = [],
  existingScenarios = [],
  recommendedScenarios = [],
  selectedCompanyId,
  onSelectCompany,
}: ScenarioManagementContentProps) {
  const hasExisting = existingScenarios.length > 0;
  const hasRecommended = recommendedScenarios.length > 0;

  return (
    <div className="space-y-6">
      <SelectCompanyCard
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={onSelectCompany}
      />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Existing Scenario</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="size-4 text-muted-foreground" />
              Existing Scenario
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasExisting ? (
              <div className="flex flex-wrap gap-2">
                {existingScenarios.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-md border bg-muted/50 px-3 py-1.5 text-sm"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No existing scenarios available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Recommended Scenario</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="size-4 text-muted-foreground" />
              Recommended Scenario
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasRecommended ? (
              <div className="flex flex-wrap gap-2">
                {recommendedScenarios.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-md border bg-muted/50 px-3 py-1.5 text-sm"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No recommended scenarios available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
