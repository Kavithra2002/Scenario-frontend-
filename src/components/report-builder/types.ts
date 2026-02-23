export type BlockType =
  | "title"
  | "text"
  | "table"
  | "chart"
  | "kpi"
  | "image"
  | "divider";

export type CanvasSize = "A4" | "A3" | "Letter";

export interface ReportBlock {
  id: string;
  type: BlockType;
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

export const CANVAS_SIZE_OPTIONS: { value: CanvasSize; label: string }[] = [
  { value: "A4", label: "A4" },
  { value: "A3", label: "A3" },
  { value: "Letter", label: "Letter" },
];
