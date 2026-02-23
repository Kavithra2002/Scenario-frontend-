/**
 * Scenario Analysis types and demo data.
 * Replace with API types and data fetching when backend is ready.
 */

export interface CompanyOption {
  id: string;
  name: string;
}

export interface MetricItem {
  label: string;
  value: string;
  changePercent: number;
  changeLabel: string;
}

export interface ScenarioOutputMetric extends MetricItem {
  /** When from backend: link to chart/detail view */
  chartRef?: string;
}

/** Company details metrics (e.g. "from last month") */
export interface CompanyDetailsData {
  metrics: MetricItem[];
}

/** Scenario output metrics (vs base scenario) */
export interface ScenarioOutputData {
  metrics: ScenarioOutputMetric[];
}

export interface ScenarioSummary {
  id: string;
  name: string;
  /** Optional: when backend provides scenario params */
  params?: Record<string, unknown>;
}

// ——— Demo data (swap for API when backend is ready) ———

export const DEMO_COMPANIES: CompanyOption[] = [];
// When backend is ready: fetch companies and pass as companies prop

export const DEMO_COMPANY_DETAILS: CompanyDetailsData = {
  metrics: [
    { label: "Revenue", value: "LKR 45.23M", changePercent: 20.1, changeLabel: "from last month" },
    { label: "Net Profit", value: "LKR 8.23M", changePercent: 15.3, changeLabel: "from last quarter" },
    { label: "EPS (Earnings Per Share)", value: "12.45", changePercent: 8.2, changeLabel: "from last year" },
    { label: "Operating Cost", value: "LKR 28.90M", changePercent: -2.4, changeLabel: "from last month" },
    { label: "Exchange Rate", value: "328.50", changePercent: 1.2, changeLabel: "from last week" },
    { label: "Interest Expenses", value: "LKR 2.46M", changePercent: 5.1, changeLabel: "from last quarter" },
    { label: "Sector Growth", value: "8.2%", changePercent: 3.2, changeLabel: "from last year" },
    { label: "Target Price", value: "LKR 156.75", changePercent: 12.8, changeLabel: "from last month" },
  ],
};

export const DEMO_SCENARIOS: ScenarioSummary[] = [];
// When backend is ready: fetch scenarios from Scenario Management and pass as scenarios prop

export const DEMO_SCENARIO_OUTPUT: ScenarioOutputData = {
  metrics: [
    { label: "Revenue", value: "LKR 48.12M", changePercent: 6.4, changeLabel: "from base scenario" },
    { label: "Net Profit", value: "LKR 9.12M", changePercent: 10.8, changeLabel: "from base scenario" },
    { label: "EPS (Earnings Per Share)", value: "13.82", changePercent: 11.0, changeLabel: "from base scenario" },
    { label: "Operating Cost", value: "LKR 27.89M", changePercent: -3.5, changeLabel: "from base scenario" },
    { label: "Exchange Rate", value: "332.20", changePercent: 1.1, changeLabel: "from base scenario" },
    { label: "Interest Expenses", value: "LKR 2.59M", changePercent: 5.4, changeLabel: "from base scenario" },
    { label: "Sector Growth", value: "9.1%", changePercent: 11.0, changeLabel: "from base scenario" },
    { label: "Target Price", value: "LKR 172.5", changePercent: 10.0, changeLabel: "from base scenario" },
  ],
};
