"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type FinancialViewFilters,
  type FinancialRow,
  type TabId,
} from "./types";
import { cn } from "@/lib/utils";

const TAB_LABELS: Record<TabId, string> = {
  overview: "Overview",
  performance: "Performance",
  valuation: "Valuation",
  dividends: "Dividends",
  profitability: "Profitability",
  "income-statement": "Income Statement",
  "balance-sheet": "Balance Sheet",
  "cash-flow": "Cash Flow",
  technicals: "Technicals",
};

const FILTER_SECTIONS = [
  {
    title: "MARKET PERFORMANCE",
    key: "marketPerformance" as const,
    options: [
      { value: "all-stocks", label: "All stocks" },
      { value: "top-gainers", label: "Top gainers" },
      { value: "biggest-losers", label: "Biggest losers" },
      { value: "best-performing", label: "Best performing" },
      { value: "most-active", label: "Most active" },
      { value: "most-volatile", label: "Most volatile" },
    ],
  },
  {
    title: "MARKET CAP",
    key: "marketCap" as const,
    options: [
      { value: "large-cap", label: "Large-cap" },
      { value: "small-cap", label: "Small-cap" },
    ],
  },
  {
    title: "FINANCIAL METRICS",
    key: "financialMetrics" as const,
    options: [
      { value: "highest-revenue", label: "Highest revenue" },
      { value: "highest-net-income", label: "Highest net income" },
      { value: "highest-cash", label: "Highest cash" },
      { value: "highest-profit-per-employee", label: "Highest profit per employee" },
      { value: "highest-revenue-per-employee", label: "Highest revenue per employee" },
    ],
  },
  {
    title: "TRADING",
    key: "trading" as const,
    options: [
      { value: "unusual-volume", label: "Unusual volume" },
      { value: "high-beta", label: "High beta" },
      { value: "overbought", label: "Overbought" },
      { value: "oversold", label: "Oversold" },
    ],
  },
  {
    title: "PRICE LEVELS",
    key: "priceLevels" as const,
    options: [
      { value: "most-expensive", label: "Most expensive" },
      { value: "penny-stocks", label: "Penny stocks" },
      { value: "all-time-high", label: "All-time high" },
      { value: "all-time-low", label: "All-time low" },
      { value: "52-week-high", label: "52-week high" },
      { value: "52-week-low", label: "52-week low" },
    ],
  },
  {
    title: "OTHER",
    key: "other" as const,
    options: [
      { value: "largest-employers", label: "Largest employers" },
      { value: "high-dividend", label: "High-dividend" },
    ],
  },
] as const;

const DEFAULT_FILTERS: FinancialViewFilters = {
  marketPerformance: "all-stocks",
  marketCap: "large-cap",
  financialMetrics: "highest-revenue",
  trading: "unusual-volume",
  priceLevels: "most-expensive",
  other: "largest-employers",
};

export default function FinancialViewPage() {
  const [filters, setFilters] = useState<FinancialViewFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Replace with API call when backend is ready, e.g.:
  // const { data: financialData, isLoading } = useFinancialData({ filters, tab: activeTab, search: searchQuery });
  const financialData: FinancialRow[] = useMemo(() => {
    // TODO: fetch from backend when ready
    return [];
  }, [filters, activeTab, searchQuery]);

  const updateFilter = <K extends keyof FinancialViewFilters>(
    key: K,
    value: FinancialViewFilters[K]
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const formatNumber = (n: number) => {
    if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    return n.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="bg-card">
        <CardContent className="px-6 py-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {FILTER_SECTIONS.map(({ title, key, options }) => (
              <div key={key} className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {title}
                </span>
                <div className="flex flex-col gap-1">
                  {options.map(({ value, label }) => {
                    const isSelected = filters[key] === value;
                    return (
                      <Button
                        key={value}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-auto justify-start px-0 text-sm font-normal",
                          isSelected
                            ? "text-primary hover:text-primary"
                            : "text-foreground hover:text-primary"
                        )}
                        onClick={() => updateFilter(key, value as never)}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs, Search & Table */}
      <Card className="bg-card">
        <CardContent className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
            <TabsList className="mb-4 w-full justify-start overflow-x-auto">
              {(Object.keys(TAB_LABELS) as TabId[]).map((tabId) => (
                <TabsTrigger key={tabId} value={tabId}>
                  {TAB_LABELS[tabId]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <span className="text-sm text-muted-foreground">Symbol O</span>
            </div>

            {(Object.keys(TAB_LABELS) as TabId[]).map((tabId) => (
              <TabsContent key={tabId} value={tabId} className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Change %</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Rel Volume</TableHead>
                        <TableHead>Market cap</TableHead>
                        <TableHead>P/E</TableHead>
                        <TableHead>EPS dil TTM</TableHead>
                        <TableHead>EPS dil growth TTM YoY</TableHead>
                        <TableHead>Div yield % TTM</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead>Analyst Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={12}
                            className="h-32 text-center text-muted-foreground"
                          >
                            <p className="font-medium">No financial data available</p>
                            <p className="text-sm">
                              Data will appear here once loaded
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        financialData.map((row) => (
                          <TableRow key={row.symbol}>
                            <TableCell className="font-medium">{row.symbol}</TableCell>
                            <TableCell>{row.price.toFixed(2)}</TableCell>
                            <TableCell
                              className={
                                row.changePercent >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {row.changePercent >= 0 ? "+" : ""}
                              {row.changePercent.toFixed(2)}%
                            </TableCell>
                            <TableCell>{formatNumber(row.volume)}</TableCell>
                            <TableCell>{row.relVolume.toFixed(2)}</TableCell>
                            <TableCell>{formatNumber(row.marketCap)}</TableCell>
                            <TableCell>
                              {row.pe != null ? row.pe.toFixed(2) : "—"}
                            </TableCell>
                            <TableCell>
                              {row.epsDilTtm != null
                                ? row.epsDilTtm.toFixed(2)
                                : "—"}
                            </TableCell>
                            <TableCell>
                              {row.epsDilGrowthTtmYoy != null
                                ? `${row.epsDilGrowthTtmYoy.toFixed(2)}%`
                                : "—"}
                            </TableCell>
                            <TableCell>
                              {row.divYieldPercentTtm != null
                                ? `${row.divYieldPercentTtm.toFixed(2)}%`
                                : "—"}
                            </TableCell>
                            <TableCell>{row.sector}</TableCell>
                            <TableCell>{row.analystRating}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Showing: {TAB_LABELS[tabId]} data
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
