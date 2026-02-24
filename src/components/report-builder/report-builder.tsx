"use client";

import { useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Link from "next/link";
import { ArrowLeft, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlocksPanel } from "./blocks-panel";
import { ReportCanvas } from "./report-canvas";
import { PropertiesPanel } from "./properties-panel";
import {
  type ReportDefinition,
  type ReportBlock,
  type BlockType,
  type CanvasSize,
  BLOCK_TYPE_LABELS,
} from "./types";
import { BLOCK_PALETTE_PREFIX, REPORT_CANVAS_ID } from "./constants";
import { getBlockDefinition } from "./block-definitions";

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createBlock(type: BlockType): ReportBlock {
  const def = getBlockDefinition(type);
  const id = generateBlockId();
  const props = {
    ...def?.defaultProps,
  } as Record<string, unknown>;
  return { id, type, props };
}

function ensureBlockProps(block: ReportBlock): ReportBlock {
  const needDefaults =
    block.props?.width == null &&
    block.props?.height == null &&
    block.props?.positionX == null;
  if (!needDefaults) return block;
  const def = getBlockDefinition(block.type);
  return {
    ...block,
    props: { ...def?.defaultProps, ...block.props },
  };
}

interface ReportBuilderProps {
  initialReport?: ReportDefinition;
  mode: "create" | "update";
  backHref: string;
  onSave?: (report: ReportDefinition) => void;
  onExportPdf?: (report: ReportDefinition) => void;
}

export function ReportBuilder({
  initialReport,
  mode,
  backHref,
  onSave,
  onExportPdf,
}: ReportBuilderProps) {
  const [reportName, setReportName] = useState(
    initialReport?.name ?? "Untitled Report"
  );
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(
    initialReport?.canvasSize ?? "A4"
  );
  const [blocks, setBlocks] = useState<ReportBlock[]>(() => {
    const initial = initialReport?.blocks ?? [];
    return initial.map((b) => ensureBlockProps(b as ReportBlock));
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeIdStr = active.id as string;
      const overIdStr = over.id as string;

      if (activeIdStr.startsWith(BLOCK_PALETTE_PREFIX)) {
        const blockType = activeIdStr.replace(
          BLOCK_PALETTE_PREFIX,
          ""
        ) as BlockType;
        if (overIdStr === REPORT_CANVAS_ID) {
          setBlocks((prev) => [...prev, createBlock(blockType)]);
          setSelectedBlockId(null);
        } else {
          const overIndex = blocks.findIndex((b) => b.id === overIdStr);
          if (overIndex !== -1) {
            const newBlock = createBlock(blockType);
            setBlocks((prev) => {
              const next = [...prev];
              next.splice(overIndex, 0, newBlock);
              return next;
            });
            setSelectedBlockId(newBlock.id);
          }
        }
        return;
      }

      if (overIdStr === REPORT_CANVAS_ID) return;

      const oldIndex = blocks.findIndex((b) => b.id === activeIdStr);
      const newIndex = blocks.findIndex((b) => b.id === overIdStr);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    },
    [blocks]
  );

  const handleUpdateBlock = useCallback(
    (id: string, props: Record<string, unknown>) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, props } : b))
      );
    },
    []
  );

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedBlockId((current) => (current === id ? null : current));
  }, []);

  const handleAddBlock = useCallback((blockType: BlockType) => {
    setBlocks((prev) => [...prev, createBlock(blockType)]);
    setSelectedBlockId(null);
  }, []);

  const report: ReportDefinition = {
    ...(initialReport?.id && { id: initialReport.id }),
    name: reportName,
    canvasSize,
    blocks,
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-4 border-b border-border bg-card px-4 py-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">
          {mode === "create" ? "Create New Report" : "Update report"}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Name</span>
          <Input
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Untitled Report"
            className="h-8 w-48"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Canvas size</span>
          <span className="text-sm font-medium">{canvasSize}</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onSave?.(report)}
            className="gap-2"
          >
            <Save className="size-4" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportPdf?.(report)}
            className="gap-2"
          >
            <Download className="size-4" />
            Export as PDF
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <BlocksPanel />
          <ReportCanvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onAddBlock={handleAddBlock}
            canvasSize={canvasSize}
          />
          <PropertiesPanel
            selectedBlock={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
          />

          <DragOverlay>
            {activeId && activeId.startsWith(BLOCK_PALETTE_PREFIX) ? (
              <div className="rounded-lg border border-primary bg-card px-4 py-3 shadow-lg">
                <span className="text-sm font-medium">
                  {
                    BLOCK_TYPE_LABELS[
                      activeId.replace(BLOCK_PALETTE_PREFIX, "") as BlockType
                    ]
                  }
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
