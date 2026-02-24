export type BlockType =
  | "title"
  | "text"
  | "table"
  | "chart"
  | "kpi"
  | "image"
  | "divider";

export type CanvasSize = "A4" | "A3" | "Letter";

/** Base layout props: width/height as CSS (e.g. "100%", "50%", "120px"), positionX 0–100. */
export interface BaseBlockProps {
  width?: string;
  height?: string;
  /** Horizontal position: left edge at this % of row (0–100). */
  positionX?: number;
}

export interface ReportBlock {
  id: string;
  type: BlockType;
  /** type-specific + width, height, positionX */
  props: Record<string, unknown>;
}

export interface ReportDefinition {
  id?: string;
  name: string;
  canvasSize: CanvasSize;
  blocks: ReportBlock[];
}

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  title: "Title",
  text: "Text",
  table: "Table",
  chart: "Chart",
  kpi: "KPI",
  image: "Image",
  divider: "Divider",
};

/** Portrait dimensions in px (~96dpi) for canvas rendering */
export const CANVAS_SIZE_PORTRAIT_PX: Record<
  CanvasSize,
  { width: number; height: number }
> = {
  A4: { width: 794, height: 1123 },
  A3: { width: 1123, height: 1587 },
  Letter: { width: 816, height: 1056 },
};
