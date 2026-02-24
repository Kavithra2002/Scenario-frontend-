"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReportBlock } from "./types";
import { getWidthPercent } from "./row-layout";

function BlockPreview({ block }: { block: ReportBlock }) {
  const p = block.props as Record<string, unknown>;
  switch (block.type) {
    case "title": {
      const level = (p.level as number) ?? 1;
      const Tag = `h${Math.min(3, Math.max(1, level))}` as "h1" | "h2" | "h3";
      return (
        <Tag className="text-lg font-semibold text-foreground">
          {(p.content as string) || "Title"}
        </Tag>
      );
    }
    case "text":
      return (
        <p className="text-sm text-muted-foreground">
          {(p.content as string) || "Text content"}
        </p>
      );
    case "table":
      return (
        <div className="rounded border border-border bg-muted/30 p-3">
          <p className="text-sm font-medium text-foreground">
            {(p.label as string) || "Table"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Table block</p>
        </div>
      );
    case "chart":
      return (
        <div className="rounded border border-border bg-muted/30 p-3">
          <p className="text-sm font-medium text-foreground">
            {(p.label as string) || "Chart"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Chart block</p>
        </div>
      );
    case "kpi":
      return (
        <div className="rounded border border-border bg-card p-3 shadow-sm">
          <p className="text-xs text-muted-foreground">
            {(p.label as string) || "KPI"}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {(p.value as string) ?? "—"}
          </p>
        </div>
      );
    case "image":
      return (
        <div className="flex min-h-[80px] items-center justify-center rounded border border-border bg-muted/30 p-4">
          {(p.url as string) ? (
            <img
              src={p.url as string}
              alt={(p.alt as string) || "Image"}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Image placeholder
            </p>
          )}
        </div>
      );
    case "divider":
      return <hr className="border-border" />;
    default:
      return <div className="text-sm text-muted-foreground">Block</div>;
  }
}

interface ReportBlockComponentProps {
  block: ReportBlock;
  isSelected: boolean;
  onSelect: () => void;
  isAloneInRow: boolean;
}

export function ReportBlockComponent({
  block,
  isSelected,
  onSelect,
  isAloneInRow,
}: ReportBlockComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { type: "canvas" as const, blockId: block.id },
  });

  const width = (block.props?.width as string) ?? "100%";
  const height = block.props?.height as string | undefined;
  const positionX = (block.props?.positionX as number) ?? 0;

  const sizeStyle: React.CSSProperties = {};
  if (height) sizeStyle.height = height;
  if (isAloneInRow) {
    sizeStyle.width = width;
    const widthPercent = getWidthPercent(block);
    const maxPosition = Math.max(0, 100 - widthPercent);
    const safePosition = Math.min(Math.max(positionX, 0), maxPosition);
    sizeStyle.marginLeft = `${safePosition}%`;
    sizeStyle.marginRight = "0";
  } else {
    sizeStyle.width = "100%";
  }

  const style = {
    ...sizeStyle,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onSelect}
      className={cn(
        "flex rounded-lg border-2 bg-card transition min-w-0 overflow-hidden",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-transparent hover:border-muted-foreground/30",
        isDragging && "opacity-50"
      )}
    >
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className={cn(
          "flex shrink-0 cursor-grab touch-none items-center justify-center self-stretch border-r border-border bg-muted/50 px-1.5 active:cursor-grabbing",
          isSelected && "bg-muted"
        )}
        title="Drag to reorder"
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 p-3">
        <BlockPreview block={block} />
      </div>
    </div>
  );
}
