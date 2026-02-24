"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { BLOCK_DEFINITIONS } from "./blockDefinitions";
import { ReportBlock } from "./ReportBlock";
import { computeRows } from "./rowLayout";
import type { BlockType, ReportBlockItem } from "./types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { CanvasSizeKey } from "./types";
import { CANVAS_SIZE_PORTRAIT_PX } from "./types";

interface ReportCanvasProps {
  blocks: ReportBlockItem[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onAddBlock?: (blockType: BlockType) => void;
  canvasSize?: CanvasSizeKey;
  /** When false, adding blocks is blocked (canvas full). */
  canAddMore?: boolean;
}

export function ReportCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  canvasSize = "A4",
  canAddMore = true,
}: ReportCanvasProps) {
  const [addOpen, setAddOpen] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: "report-canvas",
  });

  const rows = computeRows(blocks);
  const { width: canvasWidthPx, height: canvasHeightPx } =
    CANVAS_SIZE_PORTRAIT_PX[canvasSize];

  const handleSelectBlockType = (blockType: BlockType) => {
    onAddBlock?.(blockType);
    setAddOpen(false);
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-auto bg-zinc-100/50 dark:bg-zinc-900/30">
      <div
        className="mx-auto w-full flex-1 p-6 pb-14"
        style={{ maxWidth: canvasWidthPx ? `${canvasWidthPx}px` : undefined }}
      >
        <div
          ref={setNodeRef}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("[data-sortable]")) return;
            onSelectBlock(null);
          }}
          className={cn(
            "min-w-0 overflow-hidden rounded-xl border-2 border-dashed p-6 transition",
            isOver
              ? "border-blue-400 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30"
              : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900/50"
          )}
          style={{
            minHeight: canvasHeightPx ? `${canvasHeightPx}px` : undefined,
          }}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex min-w-0 flex-col gap-3 overflow-hidden">
              {blocks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500 dark:text-zinc-400">
                  <p className="text-sm font-medium">Drop blocks here</p>
                  <p className="mt-1 text-xs">
                    Drag blocks from the left panel to build your report
                  </p>
                </div>
              )}
              {rows.map((row, rowIndex) => (
                <div
                  key={row.map((b) => b.id).join("-")}
                  className="flex min-w-0 w-full flex-row items-stretch gap-2 overflow-hidden"
                >
                  {row.map((block) => (
                    <div
                      key={block.id}
                      data-sortable
                      className="min-w-0 max-w-full flex-shrink-0 overflow-hidden"
                      style={{
                        // When block is alone in row, wrapper is full width so block's width % is relative to full row
                        width: row.length === 1 ? "100%" : (block.props.width ?? "100%"),
                      }}
                    >
                      <ReportBlock
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onSelect={() => onSelectBlock(block.id)}
                        isAloneInRow={row.length === 1}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SortableContext>
        </div>
      </div>

      {/* Add block button at bottom of canvas */}
      {onAddBlock && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 justify-center">
          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                disabled={!canAddMore}
                title={canAddMore ? "Add block" : "Canvas is full"}
                className="h-10 w-10 rounded-full border-2 border-dashed border-zinc-300 bg-white shadow-md hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
                aria-label={canAddMore ? "Add block" : "Canvas is full"}
              >
                <Plus className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              className="w-56 p-2"
              sideOffset={8}
            >
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Add block
              </p>
              <div className="flex flex-col gap-0.5">
                {BLOCK_DEFINITIONS.map((def) => {
                  const Icon = def.icon;
                  return (
                    <button
                      key={def.type}
                      type="button"
                      onClick={() => handleSelectBlockType(def.type)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition",
                        "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                      {def.label}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
