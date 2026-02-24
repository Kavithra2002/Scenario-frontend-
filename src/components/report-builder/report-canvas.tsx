"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { ReportBlockComponent } from "./report-block";
import { computeRows } from "./row-layout";
import { BLOCK_DEFINITIONS } from "./block-definitions";
import type { ReportBlock, BlockType } from "./types";
import type { CanvasSize } from "./types";
import { REPORT_CANVAS_ID } from "./constants";
import { CANVAS_SIZE_PORTRAIT_PX } from "./types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ReportCanvasProps {
  blocks: ReportBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onAddBlock?: (blockType: BlockType) => void;
  canvasSize?: CanvasSize;
  isOver?: boolean;
}

export function ReportCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  canvasSize = "A4",
  isOver,
}: ReportCanvasProps) {
  const { setNodeRef, isOver: isCanvasOver } = useDroppable({
    id: REPORT_CANVAS_ID,
    data: { type: "canvas" },
  });

  const activeOver = isOver ?? isCanvasOver;
  const rows = computeRows(blocks);
  const { width: canvasWidthPx, height: canvasHeightPx } =
    CANVAS_SIZE_PORTRAIT_PX[canvasSize];

  const handleSelectBlockType = (blockType: BlockType) => {
    onAddBlock?.(blockType);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-auto">
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
            "min-w-0 overflow-hidden rounded-xl border-2 border-dashed bg-muted/20 p-6 transition-colors",
            activeOver && "border-primary/50 bg-primary/5"
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
                <div
                  className="flex flex-1 flex-col items-center justify-center py-16 text-center text-muted-foreground"
                  onClick={() => onSelectBlock(null)}
                >
                  <p className="font-medium">Drop blocks here</p>
                  <p className="mt-1 text-sm">
                    Drag blocks from the left panel or use the button below to
                    build your report.
                  </p>
                </div>
              )}
              {rows.map((row) => (
                <div
                  key={row.map((b) => b.id).join("-")}
                  data-sortable
                  className="flex min-w-0 w-full flex-row items-stretch gap-2 overflow-hidden"
                >
                  {row.map((block) => (
                    <div
                      key={block.id}
                      data-sortable
                      className="min-w-0 max-w-full flex-shrink-0 overflow-hidden"
                      style={{
                        width:
                          row.length === 1
                            ? "100%"
                            : (block.props?.width as string) ?? "100%",
                      }}
                    >
                      <ReportBlockComponent
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

      {onAddBlock && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                title="Add block"
                aria-label="Add block"
                className="h-10 w-10 rounded-full border-2 border-dashed border-border bg-card shadow-md hover:bg-accent/50"
              >
                <Plus className="size-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center" className="w-56">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Add block
              </p>
              {BLOCK_DEFINITIONS.map((def) => {
                const Icon = def.icon;
                return (
                  <DropdownMenuItem
                    key={def.type}
                    onClick={() => handleSelectBlockType(def.type)}
                    className="gap-3"
                  >
                    <Icon className="size-5 shrink-0" />
                    {def.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
