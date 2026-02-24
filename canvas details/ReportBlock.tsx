"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReportBlockItem, ReportBlockProps } from "./types";
import { getWidthPercent } from "./rowLayout";
import { cn } from "@/lib/utils";

interface ReportBlockComponentProps {
  block: ReportBlockItem;
  isSelected: boolean;
  onSelect: () => void;
  /** When true, positionX is applied (block alone in row). When false, row layout handles placement. */
  isAloneInRow?: boolean;
}

function BlockPreview({ props }: { props: ReportBlockProps }) {
  switch (props.type) {
    case "title":
      const TitleTag = `h${props.level ?? 1}` as "h1" | "h2" | "h3";
      return (
        <TitleTag className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {props.text || "Title"}
        </TitleTag>
      );
    case "text":
      return (
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {props.content || "Text content"}
        </p>
      );
    case "table":
      return (
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {props.title || "Table"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Table block</p>
        </div>
      );
    case "chart":
      return (
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {props.title || "Chart"} ({props.chartType || "bar"})
          </p>
          <p className="mt-1 text-xs text-zinc-500">Chart block</p>
        </div>
      );
    case "kpi":
      return (
        <div className="rounded border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {props.label || "KPI"}
          </p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {props.value ?? "—"}
          </p>
        </div>
      );
    case "image":
      return (
        <div className="flex h-full min-h-[80px] items-center justify-center rounded border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          {props.url ? (
            <img
              src={props.url}
              alt={props.alt || "Image"}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-center text-xs text-zinc-500">Image placeholder</p>
          )}
        </div>
      );
    case "divider":
      return <hr className="border-zinc-200 dark:border-zinc-700" />;
    default:
      return <div className="text-sm text-zinc-500">Unknown block</div>;
  }
}

export function ReportBlock({
  block,
  isSelected,
  onSelect,
  isAloneInRow = true,
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

  const { width, height, align, positionX } = block.props;
  const sizeStyle: React.CSSProperties = {};
  if (height) sizeStyle.height = height;
  // When alone in row: width and positionX are % of the full row (canvas wrapper is 100%).
  // When in a multi-block row: parent cell already has the width; block fills its cell.
  if (isAloneInRow) {
    if (width) sizeStyle.width = width;
    if (positionX != null && positionX >= 0 && positionX <= 100) {
      // Prevent the block from exceeding the canvas: clamp position so
      // left edge + width % never goes past 100% of the row.
      const widthPercent = getWidthPercent(block);
      const maxPosition = Math.max(0, 100 - widthPercent);
      const safePosition = Math.min(Math.max(positionX, 0), maxPosition);
      sizeStyle.marginLeft = `${safePosition}%`;
      sizeStyle.marginRight = "0";
    } else if (align === "center") {
      sizeStyle.marginLeft = "auto";
      sizeStyle.marginRight = "auto";
    } else if (align === "right") {
      sizeStyle.marginLeft = "auto";
      sizeStyle.marginRight = 0;
    }
  } else {
    // Fill the cell (parent already set width from block.props.width)
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
        "flex rounded-lg border-2 bg-white transition dark:bg-zinc-900",
        "min-w-0 overflow-hidden",
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400"
          : "border-transparent hover:border-zinc-200 dark:hover:border-zinc-700",
        isDragging && "opacity-50"
      )}
    >
      {/* Drag handle – only this area triggers drag */}
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className={cn(
          "flex shrink-0 cursor-grab touch-none items-center justify-center self-stretch border-r border-zinc-200 bg-zinc-50 px-1.5 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800",
          isSelected && "bg-zinc-100 dark:bg-zinc-700"
        )}
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </div>
      <div className="min-w-0 flex-1 p-3">
        <BlockPreview props={block.props} />
      </div>
    </div>
  );
}
