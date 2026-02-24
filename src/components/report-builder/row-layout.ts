import type { ReportBlock } from "./types";

/**
 * Parse block width to a percentage for row packing.
 * "30%" -> 30, "100%" -> 100, "auto" / "200px" / missing -> 100 (full row).
 */
export function getWidthPercent(block: ReportBlock): number {
  const w = block.props?.width;
  if (!w || typeof w !== "string") return 100;
  const match = String(w).trim().match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (match) return Math.min(100, Math.max(0, Number(match[1])));
  return 100;
}

/**
 * Pack blocks into rows by width %. Each row's total width must not exceed 100%.
 * A block that would push the row over 100% starts a new row.
 */
export function computeRows(blocks: ReportBlock[]): ReportBlock[][] {
  if (blocks.length === 0) return [];
  const rows: ReportBlock[][] = [];
  let currentRow: ReportBlock[] = [];
  let currentWidth = 0;
  for (const block of blocks) {
    const w = getWidthPercent(block);
    if (currentWidth + w > 100 && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }
    currentRow.push(block);
    currentWidth += w;
  }
  if (currentRow.length > 0) rows.push(currentRow);
  return rows;
}
