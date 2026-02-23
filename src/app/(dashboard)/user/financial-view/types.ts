/**
 * Types for Financial View data.
 * Replace or extend when backend API is ready.
 */

export type MarketPerformanceFilter =
  | "all-stocks"
  | "top-gainers"
  | "biggest-losers"
  | "best-performing"
  | "most-active"
  | "most-volatile";

export type MarketCapFilter = "large-cap" | "small-cap";

export type FinancialMetricsFilter =
  | "highest-revenue"
  | "highest-net-income"
  | "highest-cash"
  | "highest-profit-per-employee"
  | "highest-revenue-per-employee";

export type TradingFilter =
  | "unusual-volume"
  | "high-beta"
  | "overbought"
  | "oversold";

export type PriceLevelsFilter =
  | "most-expensive"
  | "penny-stocks"
  | "all-time-high"
  | "all-time-low"
  | "52-week-high"
  | "52-week-low";

export type OtherFilter = "largest-employers" | "high-dividend";

export type FinancialViewFilters = {
  marketPerformance?: MarketPerformanceFilter;
  marketCap?: MarketCapFilter;
  financialMetrics?: FinancialMetricsFilter;
  trading?: TradingFilter;
  priceLevels?: PriceLevelsFilter;
  other?: OtherFilter;
};

export type TabId =
  | "overview"
  | "performance"
  | "valuation"
  | "dividends"
  | "profitability"
  | "income-statement"
  | "balance-sheet"
  | "cash-flow"
  | "technicals";

export interface FinancialRow {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
  relVolume: number;
  marketCap: number;
  pe: number | null;
  epsDilTtm: number | null;
  epsDilGrowthTtmYoy: number | null;
  divYieldPercentTtm: number | null;
  sector: string;
  analystRating: string;
}

export interface FinancialViewData {
  rows: FinancialRow[];
  tab: TabId;
}
