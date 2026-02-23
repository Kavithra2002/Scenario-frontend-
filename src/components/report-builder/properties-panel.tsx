"use client";

import { Input } from "@/components/ui/input";
import type { ReportBlock } from "./types";
import { BLOCK_TYPE_LABELS } from "./types";

interface PropertiesPanelProps {
  selectedBlock: ReportBlock | null;
  onUpdateBlock: (id: string, props: Record<string, unknown>) => void;
}

export function PropertiesPanel({
  selectedBlock,
  onUpdateBlock,
}: PropertiesPanelProps) {
  if (!selectedBlock) {
    return (
      <div className="flex w-64 shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-4">
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
  const props = selectedBlock.props as Record<string, string>;

  return (
    <div className="flex w-64 shrink-0 flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Properties
      </h3>
      <div className="space-y-3">
        <p className="text-sm font-medium">{typeLabel}</p>
        {selectedBlock.type === "title" && (
          <>
            <label className="text-xs text-muted-foreground">Content</label>
            <Input
              value={(props.content as string) ?? ""}
              onChange={(e) =>
                onUpdateBlock(selectedBlock.id, {
                  ...selectedBlock.props,
                  content: e.target.value,
                })
              }
              placeholder="Title text"
            />
          </>
        )}
        {selectedBlock.type === "text" && (
          <>
            <label className="text-xs text-muted-foreground">Content</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={(props.content as string) ?? ""}
              onChange={(e) =>
                onUpdateBlock(selectedBlock.id, {
                  ...selectedBlock.props,
                  content: e.target.value,
                })
              }
              placeholder="Paragraph text"
            />
          </>
        )}
        {selectedBlock.type === "divider" && (
          <p className="text-xs text-muted-foreground">
            No configurable properties.
          </p>
        )}
        {["table", "chart", "kpi", "image"].includes(selectedBlock.type) && (
          <>
            <label className="text-xs text-muted-foreground">Label (optional)</label>
            <Input
              value={(props.label as string) ?? ""}
              onChange={(e) =>
                onUpdateBlock(selectedBlock.id, {
                  ...selectedBlock.props,
                  label: e.target.value,
                })
              }
              placeholder="Block label"
            />
          </>
        )}
      </div>
    </div>
  );
}
