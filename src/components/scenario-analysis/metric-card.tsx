"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  changePercent: number;
  changeLabel: string;
  /** Optional: show chart icon (e.g. for Scenario Output) */
  showChartIcon?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  changePercent,
  changeLabel,
  showChartIcon,
  className,
}: MetricCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <Card className={cn("relative", className)}>
      {showChartIcon && (
        <span className="absolute right-3 top-3 text-muted-foreground/70" aria-hidden>
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </span>
      )}
      <CardContent className="pt-4 pb-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-lg font-semibold">{value}</p>
        <p className={cn("mt-1 text-sm", isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
          {isPositive ? "+" : ""}{changePercent}% {changeLabel}
        </p>
      </CardContent>
    </Card>
  );
}
