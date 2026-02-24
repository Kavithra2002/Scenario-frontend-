"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BLOCK_DEFINITIONS } from "./block-definitions";
import { BLOCK_PALETTE_PREFIX } from "./constants";
import type { BlockType } from "./types";
import { Button } from "@/components/ui/button";

interface BlockPaletteItemProps {
  blockType: BlockType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function BlockPaletteItem({
  blockType,
  label,
  icon: Icon,
}: BlockPaletteItemProps) {
  const id = `${BLOCK_PALETTE_PREFIX}${blockType}`;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type: "palette", blockType },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

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
  return (
    <div className="flex w-56 shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Blocks
      </h3>
      <div className="flex flex-col gap-2">
        {BLOCK_DEFINITIONS.map((def) => (
          <BlockPaletteItem
            key={def.type}
            blockType={def.type}
            label={def.label}
            icon={def.icon}
          />
        ))}
      </div>
    </div>
  );
}
