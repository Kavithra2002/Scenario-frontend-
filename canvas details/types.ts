/**
 * Report template designer types.
 * Blocks are the building units; template is the saved layout.
 */

export type BlockType =
  | "title"
  | "text"
  | "table"
  | "chart"
  | "kpi"
  | "image"
  | "divider";

/** Horizontal position of the block on the canvas row (legacy) */
export type BlockAlign = "left" | "center" | "right";

export interface BaseBlockProps {
  id?: string;
  /** CSS width, e.g. "100%", "200px", "50%", "auto" */
  width?: string;
  /** CSS height, e.g. "auto", "120px", "200px" */
  height?: string;
  /** Where the block sits on the row (left, center, right) – legacy, use positionX for fine control */
  align?: BlockAlign;
  /** Horizontal position: left edge of block at this % of row (0–100). 0 = left, 50 = middle, 100 = right */
  positionX?: number;
}

export interface TitleBlockProps extends BaseBlockProps {
  type: "title";
  text: string;
  level?: 1 | 2 | 3; // h1, h2, h3
}

export interface TextBlockProps extends BaseBlockProps {
  type: "text";
  content: string;
}

export interface TableBlockProps extends BaseBlockProps {
  type: "table";
  title?: string;
  dataSourceId?: string;
  columns?: string;
}

export interface ChartBlockProps extends BaseBlockProps {
  type: "chart";
  title?: string;
  chartType?: "bar" | "line" | "pie";
  dataSourceId?: string;
}

export interface KpiBlockProps extends BaseBlockProps {
  type: "kpi";
  label: string;
  value?: string;
  dataSourceId?: string;
}

export interface ImageBlockProps extends BaseBlockProps {
  type: "image";
  url: string;
  alt?: string;
}

export interface DividerBlockProps extends BaseBlockProps {
  type: "divider";
}

export type ReportBlockProps =
  | TitleBlockProps
  | TextBlockProps
  | TableBlockProps
  | ChartBlockProps
  | KpiBlockProps
  | ImageBlockProps
  | DividerBlockProps;

export interface ReportBlockItem {
  id: string;
  props: ReportBlockProps;
}

export interface ReportTemplate {
  id?: string;
  name: string;
  blocks: ReportBlockItem[];
  updatedAt?: string;
}

/** Canvas / paper size preset – portrait (vertical) dimensions at ~96dpi */
export type CanvasSizeKey = "A5" | "A4" | "A3" | "Letter";

/** Portrait: width and height in px (mm * 96/25.4) so canvas is vertical */
export const CANVAS_SIZE_PORTRAIT_PX: Record<
  CanvasSizeKey,
  { width: number; height: number }
> = {
  A5: { width: 559, height: 794 },   // 148×210 mm
  A4: { width: 794, height: 1123 },  // 210×297 mm
  A3: { width: 1123, height: 1587 }, // 297×420 mm
  Letter: { width: 816, height: 1056 }, // 216×279 mm
};

/** Max width in px (kept for compatibility) */
export const CANVAS_SIZE_PX: Record<CanvasSizeKey, number> = {
  A5: 559,
  A4: 794,
  A3: 1123,
  Letter: 816,
};

/** Drag payload when dragging from palette (new block type) */
export interface PaletteDragItem {
  type: "palette";
  blockType: BlockType;
}

/** Drag payload when reordering on canvas */
export interface CanvasDragItem {
  type: "canvas";
  blockId: string;
}

export type DragItem = PaletteDragItem | CanvasDragItem;

export function isPaletteDrag(item: DragItem | null): item is PaletteDragItem {
  return item?.type === "palette";
}

export function isCanvasDrag(item: DragItem | null): item is CanvasDragItem {
  return item?.type === "canvas";
}
