"use client";

import { Input } from "@/components/ui/input";
import type { ReportBlock } from "./types";
import { BLOCK_TYPE_LABELS } from "./types";
import { getWidthPercent } from "./row-layout";
import { cn } from "@/lib/utils";

interface PropertiesPanelProps {
  selectedBlock: ReportBlock | null;
  onUpdateBlock: (id: string, props: Record<string, unknown>) => void;
  onDeleteBlock?: (id: string) => void;
}

export function PropertiesPanel({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
}: PropertiesPanelProps) {
  if (!selectedBlock) {
    return (
      <div className="flex w-72 shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a block to edit its properties.
        </p>
      </div>
    );
  }

  const typeLabel = BLOCK_TYPE_LABELS[selectedBlock.type];
  const props = selectedBlock.props as Record<string, unknown>;

  const widthStr = (props.width as string) ?? "100%";
  const isFullWidth = widthStr.toString().trim() === "100%";
  const widthPercent = getWidthPercent(selectedBlock);
  const maxPositionX = Math.max(0, 100 - widthPercent);
  const currentPositionX = Math.min(
    Math.max((props.positionX as number) ?? 0, 0),
    maxPositionX
  );

  const heightStr = (props.height as string) ?? "auto";
  const parsedHeightMatch =
    typeof heightStr === "string"
      ? heightStr.trim().match(/^(\d+(?:\.\d+)?)\s*px$/)
      : null;
  const heightValuePx = parsedHeightMatch
    ? Number(parsedHeightMatch[1])
    : 80;

  const handleChange = (updates: Record<string, unknown>) => {
    const next = { ...selectedBlock.props, ...updates };
    if (updates.width !== undefined) {
      const nextWidthPercent = getWidthPercent({
        ...selectedBlock,
        props: next,
      });
      const nextMaxPos = Math.max(0, 100 - nextWidthPercent);
      const pos = (next.positionX as number) ?? 0;
      if (pos > nextMaxPos) {
        (next as Record<string, unknown>).positionX = nextMaxPos;
      }
    }
    onUpdateBlock(selectedBlock.id, next);
  };

  const setPositionX = (value: number) => {
    handleChange({
      positionX: Math.min(maxPositionX, Math.max(0, value)),
    });
  };

  return (
    <div className="flex w-72 shrink-0 flex-col gap-4 overflow-auto rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Properties
      </h3>

      <div className="space-y-4">
        <p className="text-sm font-medium">{typeLabel}</p>

        {/* Size */}
        <div className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground">Size</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Width</label>
              <Input
                value={widthStr}
                onChange={(e) => handleChange({ width: e.target.value })}
                className="mt-1"
                placeholder="100%, 50%, 200px"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Height</label>
              <Input
                value={heightStr}
                onChange={(e) => handleChange({ height: e.target.value })}
                className="mt-1"
                placeholder="auto, 120px"
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Use px, %, or auto. Width % controls row packing (e.g. 50% + 50% = same row).
          </p>
        </div>

        {/* Block height presets + manual */}
        <div className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground">Block height</p>
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
                  heightStr === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
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
                className="h-2 flex-1 cursor-pointer accent-primary"
              />
              <Input
                type="number"
                min={40}
                max={600}
                value={heightValuePx}
                onChange={(e) => {
                  const v =
                    e.target.value === ""
                      ? heightValuePx
                      : Number(e.target.value);
                  const clamped = Math.min(
                    600,
                    Math.max(40, isNaN(v) ? heightValuePx : v)
                  );
                  handleChange({ height: `${clamped}px` });
                }}
                className="w-16 shrink-0 text-center text-xs tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Horizontal position */}
        <div
          className={cn(
            "space-y-2 rounded-md border border-border/60 bg-muted/30 p-3",
            isFullWidth && "pointer-events-none opacity-60"
          )}
        >
          <p className="text-xs font-medium text-muted-foreground">
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
              className="h-2 flex-1 cursor-pointer accent-primary disabled:cursor-not-allowed"
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
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {pct}%
                </button>
              ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isFullWidth
              ? "Not available when width is 100%."
              : `Left edge 0–${maxPositionX}% of row.`}
          </p>
        </div>

        {/* Type-specific content */}
        {selectedBlock.type === "title" && (
          <>
            <div>
              <label className="text-xs text-muted-foreground">Content</label>
              <Input
                value={(props.content as string) ?? ""}
                onChange={(e) =>
                  handleChange({ content: e.target.value })
                }
                className="mt-1"
                placeholder="Title text"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Level</label>
              <select
                value={String(props.level ?? 1)}
                onChange={(e) =>
                  handleChange({ level: Number(e.target.value) as 1 | 2 | 3 })
                }
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
              </select>
            </div>
          </>
        )}

        {selectedBlock.type === "text" && (
          <div>
            <label className="text-xs text-muted-foreground">Content</label>
            <textarea
              value={(props.content as string) ?? ""}
              onChange={(e) =>
                handleChange({ content: e.target.value })
              }
              className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Paragraph text"
              rows={4}
            />
          </div>
        )}

        {selectedBlock.type === "table" && (
          <div>
            <label className="text-xs text-muted-foreground">Label (optional)</label>
            <Input
              value={(props.label as string) ?? ""}
              onChange={(e) => handleChange({ label: e.target.value })}
              className="mt-1"
              placeholder="Table title"
            />
          </div>
        )}

        {selectedBlock.type === "chart" && (
          <div>
            <label className="text-xs text-muted-foreground">Label (optional)</label>
            <Input
              value={(props.label as string) ?? ""}
              onChange={(e) => handleChange({ label: e.target.value })}
              className="mt-1"
              placeholder="Chart title"
            />
          </div>
        )}

        {selectedBlock.type === "kpi" && (
          <>
            <div>
              <label className="text-xs text-muted-foreground">Label</label>
              <Input
                value={(props.label as string) ?? ""}
                onChange={(e) => handleChange({ label: e.target.value })}
                className="mt-1"
                placeholder="KPI label"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Value</label>
              <Input
                value={(props.value as string) ?? ""}
                onChange={(e) => handleChange({ value: e.target.value })}
                className="mt-1"
                placeholder="Value or —"
              />
            </div>
          </>
        )}

        {selectedBlock.type === "image" && (
          <>
            <div>
              <label className="text-xs text-muted-foreground">Image URL</label>
              <Input
                value={(props.url as string) ?? ""}
                onChange={(e) => handleChange({ url: e.target.value })}
                className="mt-1"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Alt text</label>
              <Input
                value={(props.alt as string) ?? ""}
                onChange={(e) => handleChange({ alt: e.target.value })}
                className="mt-1"
                placeholder="Description"
              />
            </div>
          </>
        )}

        {selectedBlock.type === "divider" && (
          <p className="text-sm text-muted-foreground">No properties to edit.</p>
        )}
      </div>

      {onDeleteBlock && (
        <button
          type="button"
          onClick={() => onDeleteBlock(selectedBlock.id)}
          className="mt-4 text-sm text-destructive hover:underline"
        >
          Remove block
        </button>
      )}
    </div>
  );
}
