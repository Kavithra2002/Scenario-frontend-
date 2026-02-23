"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MainTab = "today_market" | "financial_data" | "non_financial_data";
type IndicesTab = "popular" | "top_performance" | "under_performance";
type VariablesTab = "index_variables" | "macro" | "sentiment";

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="font-medium text-muted-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export default function MarketPage() {
  const [mainTab, setMainTab] = useState<MainTab>("today_market");
  const [indicesTab, setIndicesTab] = useState<IndicesTab>("popular");
  const [variablesTab, setVariablesTab] = useState<VariablesTab>("index_variables");

  return (
    <div className="space-y-4">
      <Tabs
        value={mainTab}
        onValueChange={(v) => setMainTab(v as MainTab)}
        className="w-full"
      >
        <TabsList className="mb-4 grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="today_market">Today Market</TabsTrigger>
          <TabsTrigger value="financial_data">Financial Data</TabsTrigger>
          <TabsTrigger value="non_financial_data">Non Financial Data</TabsTrigger>
        </TabsList>

        <TabsContent value="today_market" className="mt-0 space-y-4">
          {/* First section: Popular Indices / Top Performance / Under Performance */}
          <Card className="bg-card">
            <CardContent className="px-6 py-4">
              <Tabs
                value={indicesTab}
                onValueChange={(v) => setIndicesTab(v as IndicesTab)}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="popular">Popular Indices</TabsTrigger>
                  <TabsTrigger value="top_performance">Top Performance</TabsTrigger>
                  <TabsTrigger value="under_performance">
                    Under Performance
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="popular" className="mt-0">
                  <EmptyState
                    title="No index data available"
                    subtitle="Data will appear here once loaded"
                  />
                </TabsContent>
                <TabsContent value="top_performance" className="mt-0">
                  <EmptyState
                    title="No performance data available"
                    subtitle="Data will appear here once loaded"
                  />
                </TabsContent>
                <TabsContent value="under_performance" className="mt-0">
                  <EmptyState
                    title="No under performance data available"
                    subtitle="Data will appear here once loaded"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Second section: Index Variables / Macroeconomic / Market Sentiment */}
          <Card className="bg-card">
            <CardContent className="px-6 py-4">
              <Tabs
                value={variablesTab}
                onValueChange={(v) => setVariablesTab(v as VariablesTab)}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="index_variables">Index Variables</TabsTrigger>
                  <TabsTrigger value="macro">
                    Macroeconomic Determinants
                  </TabsTrigger>
                  <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
                </TabsList>
                <TabsContent value="index_variables" className="mt-0">
                  <EmptyState
                    title="No variable data available"
                    subtitle="Data will appear here once loaded"
                  />
                </TabsContent>
                <TabsContent value="macro" className="mt-0">
                  <EmptyState
                    title="No macroeconomic data available"
                    subtitle="Data will appear here once loaded"
                  />
                </TabsContent>
                <TabsContent value="sentiment" className="mt-0">
                  <EmptyState
                    title="No market sentiment data available"
                    subtitle="Data will appear here once loaded"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Chart placeholders */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card">
              <CardContent className="flex min-h-[200px] flex-col items-center justify-center py-8">
                <EmptyState
                  title="No chart data available"
                  subtitle="Chart will appear here once loaded"
                />
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="flex min-h-[200px] flex-col items-center justify-center py-8">
                <EmptyState
                  title="No chart data available"
                  subtitle="Chart will appear here once loaded"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial_data" className="mt-0">
          <Card className="bg-card">
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center py-12">
              <EmptyState
                title="No financial data available"
                subtitle="Data will appear here once loaded"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non_financial_data" className="mt-0">
          <Card className="bg-card">
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center py-12">
              <EmptyState
                title="No non-financial data available"
                subtitle="Data will appear here once loaded"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
