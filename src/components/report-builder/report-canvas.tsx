"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { ReportBlock, BlockType } from "./types";
import { REPORT_CANVAS_ID } from "./constants";
import { BLOCK_TYPE_LABELS } from "./types";
import {
  Type,
  AlignLeft,
  Table2,
  BarChart3,
  TrendingUp,
  Image,
  Minus,
  GripVertical,
  type LucideIcon,
} from "lucide-react";

const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  title: Type,
  text: AlignLeft,
  table: Table2,
  chart: BarChart3,
  kpi: TrendingUp,
  image: Image,
  divider: Minus,
};

function CanvasBlock({
  block,
  isSelected,
  onSelect,
}: {
  block: ReportBlock;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { type: "canvas", block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = BLOCK_ICONS[block.type];
  const label = BLOCK_TYPE_LABELS[block.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex cursor-pointer items-center gap-2 rounded-lg border bg-card px-3 py-2 transition-colors",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-muted-foreground/30",
        isDragging && "opacity-50"
      )}
      onClick={onSelect}
    >
      <button
        type="button"
        className="touch-none cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...listeners}
        {...attributes}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-4" />
      </button>
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

interface ReportCanvasProps {
  blocks: ReportBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  canvasSize: string;
  isOver?: boolean;
}

export function ReportCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  canvasSize,
  isOver,
}: ReportCanvasProps) {
  const { setNodeRef, isOver: isCanvasOver } = useDroppable({
    id: REPORT_CANVAS_ID,
    data: { type: "canvas" },
  });

  const activeOver = isOver ?? isCanvasOver;

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-start overflow-auto p-6">
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[500px] w-full max-w-[210mm] flex-col gap-3 rounded-lg border-2 border-dashed bg-muted/20 p-6 transition-colors",
          activeOver && "border-primary/50 bg-primary/5"
        )}
        style={{
          minHeight: canvasSize === "A3" ? "297mm" : canvasSize === "Letter" ? "279mm" : "297mm",
          maxWidth: canvasSize === "A3" ? "420mm" : canvasSize === "Letter" ? "216mm" : "210mm",
        }}
      >
        {blocks.length === 0 ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground"
            onClick={() => onSelectBlock(null)}
          >
            <p className="font-medium">Drop blocks here</p>
            <p className="text-sm">
              Drag blocks from the left panel to build your report.
            </p>
          </div>
        ) : (
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block) => (
              <CanvasBlock
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onSelectBlock(block.id)}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
