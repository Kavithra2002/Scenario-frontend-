"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportBlockItem, ReportBlockProps } from "./types";
import { getWidthPercent } from "./rowLayout";
import { cn } from "@/lib/utils";

interface BlockPropertiesPanelProps {
  block: ReportBlockItem | null;
  onUpdate: (id: string, props: ReportBlockProps) => void;
  onDelete?: (id: string) => void;
}

export function BlockPropertiesPanel({
  block,
  onUpdate,
  onDelete,
}: BlockPropertiesPanelProps) {
  if (!block) {
    return (
      <div className="flex w-72 flex-shrink-0 flex-col border-l border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Properties
        </h3>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Select a block to edit its properties.
        </p>
      </div>
    );
  }

  const { id, props: blockProps } = block;

  const isFullWidth =
    (blockProps.width ?? "100%").toString().trim() === "100%";

  const widthPercent = getWidthPercent(block);
  const maxPositionX = Math.max(0, 100 - widthPercent);
  const currentPositionX = Math.min(
    Math.max(blockProps.positionX ?? 0, 0),
    maxPositionX
  );

  // Derive a numeric height (px) for manual adjustment.
  // If height is like "160px" -> 160, otherwise fall back to 160.
  const parsedHeightMatch =
    typeof blockProps.height === "string"
      ? blockProps.height.trim().match(/^(\d+(?:\.\d+)?)\s*px$/)
      : null;
  const heightValuePx = parsedHeightMatch
    ? Number(parsedHeightMatch[1])
    : 160;

  const handleChange = (updates: Partial<ReportBlockProps>) => {
    let next = { ...blockProps, ...updates } as ReportBlockProps;
    if (updates.width !== undefined) {
      const nextWidthPercent = getWidthPercent({
        ...block,
        props: next,
      });
      const nextMaxPos = Math.max(0, 100 - nextWidthPercent);
      const pos = next.positionX ?? 0;
      if (pos > nextMaxPos) next = { ...next, positionX: nextMaxPos };
    }
    onUpdate(id, next);
  };

  const setPositionX = (value: number) => {
    handleChange({
      positionX: Math.min(maxPositionX, Math.max(0, value)),
    });
  };

  return (
    <div className="flex w-72 flex-shrink-0 flex-col gap-4 overflow-auto border-l border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Properties
      </h3>

      <div className="space-y-4">
        {/* Size – available for all blocks */}
        <div className="space-y-2 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Size
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-zinc-500">Width</Label>
              <Input
                value={blockProps.width ?? ""}
                onChange={(e) => handleChange({ width: e.target.value })}
                className="mt-1"
                placeholder="100%, 200px, auto"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Height</Label>
              <Input
                value={blockProps.height ?? ""}
                onChange={(e) => handleChange({ height: e.target.value })}
                className="mt-1"
                placeholder="auto, 120px"
              />
            </div>
          </div>
          <p className="mt-1 text-[10px] text-zinc-400">
            Use px, %, em, or auto
          </p>
        </div>

        {/* Block height – presets + manual (px) adjustment */}
        <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Block height
          </p>
          <p className="text-[10px] text-zinc-400">
            Quick presets, manual slider, or set custom in Size above.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Auto", value: "auto" },
              { label: "80px", value: "80px" },
              { label: "120px", value: "120px" },
              { label: "160px", value: "160px" },
              { label: "200px", value: "200px" },
              { label: "240px", value: "240px" },
            ].map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange({ height: value })}
                className={cn(
                  "rounded px-2 py-1.5 text-xs font-medium transition",
                  (blockProps.height ?? "auto") === value
                    ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Manual height control in pixels */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>Manual height (px)</span>
              <span className="tabular-nums">{heightValuePx}px</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={40}
                max={600}
                value={heightValuePx}
                onChange={(e) =>
                  handleChange({ height: `${Number(e.target.value)}px` })
                }
                className="h-2 flex-1 cursor-pointer accent-blue-600 dark:accent-blue-400"
              />
              <Input
                type="number"
                min={40}
                max={600}
                value={heightValuePx}
                onChange={(e) => {
                  const v =
                    e.target.value === "" ? heightValuePx : Number(e.target.value);
                  const clamped = Math.min(600, Math.max(40, isNaN(v) ? heightValuePx : v));
                  handleChange({ height: `${clamped}px` });
                }}
                className="w-16 shrink-0 text-center text-xs tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Position on canvas – disabled when width is 100% */}
        <div
          className={cn(
            "space-y-2 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50",
            isFullWidth && "pointer-events-none opacity-60"
          )}
        >
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Horizontal position (%)
          </p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={maxPositionX}
              disabled={isFullWidth}
              value={currentPositionX}
              onChange={(e) => setPositionX(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer accent-blue-600 dark:accent-blue-400 disabled:cursor-not-allowed"
            />
            <Input
              type="number"
              min={0}
              max={maxPositionX}
              disabled={isFullWidth}
              value={currentPositionX}
              onChange={(e) => {
                const v = e.target.value === "" ? 0 : Number(e.target.value);
                setPositionX(isNaN(v) ? 0 : v);
              }}
              className="w-14 shrink-0 text-center text-sm tabular-nums"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {[0, 25, 50, 75, 100]
              .filter((pct) => pct <= maxPositionX)
              .map((pct) => (
                <button
                  key={pct}
                  type="button"
                  disabled={isFullWidth}
                  onClick={() => setPositionX(pct)}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-medium transition",
                    currentPositionX === pct
                      ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  )}
                >
                  {pct}%
                </button>
              ))}
          </div>
          <p className="text-[10px] text-zinc-400">
            {isFullWidth
              ? "Not available when width is 100%."
              : `Left edge 0–${maxPositionX}% (max so block stays in canvas).`}
          </p>
        </div>

        {blockProps.type === "title" && (
          <>
            <div>
              <Label className="text-xs">Text</Label>
              <Input
                value={blockProps.text}
                onChange={(e) => handleChange({ text: e.target.value })}
                className="mt-1"
                placeholder="Title text"
              />
            </div>
            <div>
              <Label className="text-xs">Level</Label>
              <Select
                value={String(blockProps.level ?? 1)}
                onValueChange={(v) =>
                  handleChange({ level: Number(v) as 1 | 2 | 3 })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Heading 1</SelectItem>
                  <SelectItem value="2">Heading 2</SelectItem>
                  <SelectItem value="3">Heading 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {blockProps.type === "text" && (
          <div>
            <Label className="text-xs">Content</Label>
            <textarea
              value={blockProps.content}
              onChange={(e) => handleChange({ content: e.target.value })}
              className={cn(
                "mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              placeholder="Text content"
              rows={4}
            />
          </div>
        )}

        {blockProps.type === "table" && (
          <>
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={blockProps.title ?? ""}
                onChange={(e) => handleChange({ title: e.target.value })}
                className="mt-1"
                placeholder="Table title"
              />
            </div>
            <div>
              <Label className="text-xs">Data source ID</Label>
              <Input
                value={blockProps.dataSourceId ?? ""}
                onChange={(e) =>
                  handleChange({ dataSourceId: e.target.value })
                }
                className="mt-1"
                placeholder="Optional"
              />
            </div>
          </>
        )}

        {blockProps.type === "chart" && (
          <>
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={blockProps.title ?? ""}
                onChange={(e) => handleChange({ title: e.target.value })}
                className="mt-1"
                placeholder="Chart title"
              />
            </div>
            <div>
              <Label className="text-xs">Chart type</Label>
              <Select
                value={blockProps.chartType ?? "bar"}
                onValueChange={(v) =>
                  handleChange({
                    chartType: v as "bar" | "line" | "pie",
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Data source ID</Label>
              <Input
                value={blockProps.dataSourceId ?? ""}
                onChange={(e) =>
                  handleChange({ dataSourceId: e.target.value })
                }
                className="mt-1"
                placeholder="Optional"
              />
            </div>
          </>
        )}

        {blockProps.type === "kpi" && (
          <>
            <div>
              <Label className="text-xs">Label</Label>
              <Input
                value={blockProps.label ?? ""}
                onChange={(e) => handleChange({ label: e.target.value })}
                className="mt-1"
                placeholder="KPI label"
              />
            </div>
            <div>
              <Label className="text-xs">Value</Label>
              <Input
                value={blockProps.value ?? ""}
                onChange={(e) => handleChange({ value: e.target.value })}
                className="mt-1"
                placeholder="Value or —"
              />
            </div>
            <div>
              <Label className="text-xs">Data source ID</Label>
              <Input
                value={blockProps.dataSourceId ?? ""}
                onChange={(e) =>
                  handleChange({ dataSourceId: e.target.value })
                }
                className="mt-1"
                placeholder="Optional"
              />
            </div>
          </>
        )}

        {blockProps.type === "image" && (
          <>
            <div>
              <Label className="text-xs">Image URL</Label>
              <Input
                value={blockProps.url ?? ""}
                onChange={(e) => handleChange({ url: e.target.value })}
                className="mt-1"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-xs">Alt text</Label>
              <Input
                value={blockProps.alt ?? ""}
                onChange={(e) => handleChange({ alt: e.target.value })}
                className="mt-1"
                placeholder="Description"
              />
            </div>
          </>
        )}

        {blockProps.type === "divider" && (
          <p className="text-sm text-zinc-500">No properties to edit.</p>
        )}
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="mt-4 text-sm text-red-600 hover:underline dark:text-red-400"
        >
          Remove block
        </button>
      )}
    </div>
  );
}
