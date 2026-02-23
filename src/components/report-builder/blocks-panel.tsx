"use client";

import {
  Type,
  AlignLeft,
  Table2,
  BarChart3,
  TrendingUp,
  Image,
  Minus,
  type LucideIcon,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { BLOCK_TYPE_LABELS, type BlockType } from "./types";
import { BLOCK_PALETTE_PREFIX } from "./constants";

const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  title: Type,
  text: AlignLeft,
  table: Table2,
  chart: BarChart3,
  kpi: TrendingUp,
  image: Image,
  divider: Minus,
};

interface BlockPaletteItemProps {
  blockType: BlockType;
}

function BlockPaletteItem({ blockType }: BlockPaletteItemProps) {
  const id = `${BLOCK_PALETTE_PREFIX}${blockType}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id,
    data: { type: "palette", blockType },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const Icon = BLOCK_ICONS[blockType];
  const label = BLOCK_TYPE_LABELS[blockType];

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      className="h-auto w-full justify-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left font-normal shadow-sm hover:bg-accent/50"
      style={style}
      {...listeners}
      {...attributes}
    >
      <Icon className="size-5 shrink-0 text-muted-foreground" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}

export function BlocksPanel() {
  const blockTypes: BlockType[] = [
    "title",
    "text",
    "table",
    "chart",
    "kpi",
    "image",
    "divider",
  ];

  return (
    <div className="flex w-56 shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Blocks
      </h3>
      <div className="flex flex-col gap-2">
        {blockTypes.map((type) => (
          <BlockPaletteItem key={type} blockType={type} />
        ))}
      </div>
    </div>
  );
}
