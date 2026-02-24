"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BLOCK_DEFINITIONS } from "./blockDefinitions";
import type { BlockType } from "./types";
import { cn } from "@/lib/utils";

interface PaletteItemProps {
  blockType: BlockType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function PaletteItem({ blockType, label, icon: Icon }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `palette-${blockType}`,
      data: { type: "palette" as const, blockType },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-700",
        isDragging && "opacity-50"
      )}
    >
      <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </span>
    </div>
  );
}

export function BlockPalette() {
  return (
    <div className="flex w-56 flex-shrink-0 flex-col gap-2 border-r border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Blocks
      </h3>
      {BLOCK_DEFINITIONS.map((def) => (
        <PaletteItem
          key={def.type}
          blockType={def.type}
          label={def.label}
          icon={def.icon}
        />
      ))}
    </div>
  );
}
