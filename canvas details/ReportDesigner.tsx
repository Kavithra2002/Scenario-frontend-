"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { BlockPalette } from "./BlockPalette";
import { ReportCanvas } from "./ReportCanvas";
import { BlockPropertiesPanel } from "./BlockPropertiesPanel";
import { getBlockDefinition } from "./blockDefinitions";
import { computeRows } from "./rowLayout";
import type {
  BlockType,
  ReportBlockItem,
  ReportBlockProps,
  ReportTemplate,
} from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CanvasSizeKey } from "./types";
import { CANVAS_SIZE_PORTRAIT_PX } from "./types";

const CANVAS_SIZE_OPTIONS: { value: CanvasSizeKey; label: string }[] = [
  { value: "A5", label: "A5" },
  { value: "A4", label: "A4" },
  { value: "A3", label: "A3" },
  { value: "Letter", label: "Letter" },
];

const TEMPLATE_STORAGE_KEY = "ambeon-report-templates";

const ROW_GAP_PX = 12;
const CANVAS_PADDING_PX = 48; // p-6 top + bottom
const DEFAULT_BLOCK_HEIGHT_PX = 80;

function parseHeightToPx(height: string | undefined): number {
  if (!height || typeof height !== "string") return DEFAULT_BLOCK_HEIGHT_PX;
  const s = height.trim();
  const pxMatch = s.match(/^(\d+(?:\.\d+)?)\s*px$/);
  if (pxMatch) return Math.max(20, Number(pxMatch[1]));
  return DEFAULT_BLOCK_HEIGHT_PX; // auto, %, etc.
}

function estimateBlockHeightPx(block: ReportBlockItem): number {
  return parseHeightToPx(block.props.height);
}

function estimateTotalContentHeight(blocks: ReportBlockItem[]): number {
  if (blocks.length === 0) return 0;
  const rows = computeRows(blocks);
  let total = 0;
  for (let i = 0; i < rows.length; i++) {
    const rowHeight = Math.max(
      ...rows[i].map((b) => estimateBlockHeightPx(b)),
      DEFAULT_BLOCK_HEIGHT_PX
    );
    total += rowHeight;
    if (i < rows.length - 1) total += ROW_GAP_PX;
  }
  return total;
}

function canAddBlock(
  currentBlocks: ReportBlockItem[],
  newBlock: ReportBlockItem,
  canvasSizeKey: CanvasSizeKey
): boolean {
  const { height: maxCanvasHeight } = CANVAS_SIZE_PORTRAIT_PX[canvasSizeKey];
  const usableHeight = maxCanvasHeight - CANVAS_PADDING_PX;
  const currentTotal = estimateTotalContentHeight(currentBlocks);
  const newBlockHeight = estimateBlockHeightPx(newBlock);
  return currentTotal + ROW_GAP_PX + newBlockHeight <= usableHeight;
}

/** True if there is room to add at least one more block (using default height). */
function canAddAnyBlock(
  currentBlocks: ReportBlockItem[],
  canvasSizeKey: CanvasSizeKey
): boolean {
  const { height: maxCanvasHeight } = CANVAS_SIZE_PORTRAIT_PX[canvasSizeKey];
  const usableHeight = maxCanvasHeight - CANVAS_PADDING_PX;
  const currentTotal = estimateTotalContentHeight(currentBlocks);
  return (
    currentTotal + ROW_GAP_PX + DEFAULT_BLOCK_HEIGHT_PX <= usableHeight
  );
}

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createBlockFromType(blockType: BlockType): ReportBlockItem {
  const def = getBlockDefinition(blockType);
  const id = generateBlockId();
  const props = {
    ...def?.defaultProps,
    type: blockType,
  } as ReportBlockProps;
  return { id, props };
}

interface ReportDesignerProps {
  mode: "create" | "update";
  initialTemplate?: ReportTemplate | null;
  onSave?: (template: ReportTemplate) => void;
  className?: string;
}

export function ReportDesigner({
  mode,
  initialTemplate = null,
  onSave,
  className,
}: ReportDesignerProps) {
  const [blocks, setBlocks] = useState<ReportBlockItem[]>(
    initialTemplate?.blocks ?? []
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState(
    initialTemplate?.name ?? "Untitled Report"
  );
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [canvasSize, setCanvasSize] = useState<CanvasSizeKey>("A4");

  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    setSaveMessage(null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const data = active.data.current as { type?: string; blockType?: BlockType; blockId?: string } | undefined;
    const fromPalette = String(active.id).startsWith("palette-");

    if (fromPalette && data?.blockType) {
      const blockType = data.blockType;
      const newBlock = createBlockFromType(blockType);
      if (!canAddBlock(blocks, newBlock, canvasSize)) {
        setSaveMessage(
          "Canvas is full. Remove items or choose a larger canvas size."
        );
        return;
      }
      setSaveMessage(null);
      setBlocks((prev) => {
        if (over.id === "report-canvas") {
          return [...prev, newBlock];
        }
        const overIndex = prev.findIndex((b) => b.id === over.id);
        if (overIndex === -1) return [...prev, newBlock];
        const next = [...prev];
        next.splice(overIndex, 0, newBlock);
        return next;
      });
      setSelectedBlockId(newBlock.id);
      return;
    }

    if (!fromPalette && over.id !== "report-canvas") {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  }, [blocks, canvasSize]);

  const handleUpdateBlock = useCallback((id: string, props: ReportBlockProps) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, props } : b))
    );
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }, [selectedBlockId]);

  const handleAddBlock = useCallback(
    (blockType: BlockType) => {
      const newBlock = createBlockFromType(blockType);
      if (!canAddBlock(blocks, newBlock, canvasSize)) {
        setSaveMessage(
          "Canvas is full. Remove items or choose a larger canvas size."
        );
        return;
      }
      setSaveMessage(null);
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);
    },
    [blocks, canvasSize]
  );

  const handleSave = useCallback(() => {
    const template: ReportTemplate = {
      id: initialTemplate?.id,
      name: templateName,
      blocks,
      updatedAt: new Date().toISOString(),
    };
    try {
      const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      const list: ReportTemplate[] = stored ? JSON.parse(stored) : [];
      const existing = template.id
        ? list.findIndex((t) => t.id === template.id)
        : -1;
      const toSave = { ...template, id: template.id ?? `tpl-${Date.now()}` };
      const next = existing >= 0
        ? list.map((t, i) => (i === existing ? toSave : t))
        : [...list, toSave];
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(next));
      setSaveMessage("Template saved locally.");
      onSave?.(toSave);
    } catch {
      setSaveMessage("Failed to save.");
    }
  }, [templateName, blocks, initialTemplate?.id, onSave]);

  const handleExportPdf = useCallback(() => {
    const title = templateName;
    const blockToHtml = (b: ReportBlockItem): string => {
      const p = b.props;
      let inner: string;
      switch (p.type) {
        case "title": {
          const Tag = `h${p.level ?? 1}`;
          inner = `<${Tag}>${escapeHtml(p.text || "")}</${Tag}>`;
          break;
        }
        case "text":
          inner = `<p>${escapeHtml(p.content || "").replace(/\n/g, "<br/>")}</p>`;
          break;
        case "table":
          inner = `<div class="report-table"><h4>${escapeHtml(p.title || "Table")}</h4><p>Table data</p></div>`;
          break;
        case "chart":
          inner = `<div class="report-chart"><h4>${escapeHtml(p.title || "Chart")}</h4><p>Chart</p></div>`;
          break;
        case "kpi":
          inner = `<div class="report-kpi"><span class="label">${escapeHtml(p.label || "")}</span><span class="value">${escapeHtml(p.value ?? "—")}</span></div>`;
          break;
        case "image":
          inner = p.url ? `<img src="${escapeAttr(p.url)}" alt="${escapeAttr(p.alt || "")}" />` : "";
          break;
        case "divider":
          inner = "<hr/>";
          break;
        default:
          inner = "";
      }
      const style: string[] = [];
      if (p.width) style.push(`width:${p.width}`);
      if (p.height) style.push(`height:${p.height}`);
      return style.length > 0 ? `<div style="${style.join(";")}">${inner}</div>` : inner;
    };
    const rows = computeRows(blocks);
    const body = rows
      .map(
        (row) =>
          `<div style="display:flex;gap:0.5rem;width:100%;margin-bottom:0.5rem">${row
            .map((b) => blockToHtml(b))
            .join("")}</div>`
      )
      .join("\n");

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>${escapeHtml(title)}</title></head>
<body><article>${body}</article></body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank", "noopener");
    if (w) {
      w.onload = () => {
        w.print();
        URL.revokeObjectURL(url);
      };
    } else {
      URL.revokeObjectURL(url);
    }
  }, [templateName, blocks]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Toolbar */}
      <div className="flex flex-shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <Label htmlFor="template-name" className="text-xs text-zinc-500">
            Name
          </Label>
          <Input
            id="template-name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="max-w-xs"
            placeholder="Report name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-zinc-500">Canvas size</Label>
          <Select
            value={canvasSize}
            onValueChange={(v) => setCanvasSize(v as CanvasSizeKey)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {CANVAS_SIZE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
        </div>
        {saveMessage && (
          <span className="text-sm text-zinc-500">{saveMessage}</span>
        )}
      </div>

      {/* Designer area - DndContext only after mount to avoid SSR hydration mismatch (aria-describedby ID) */}
      <div className="flex flex-1 overflow-hidden">
        {mounted ? (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <BlockPalette />
            <ReportCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onAddBlock={handleAddBlock}
              canvasSize={canvasSize}
              canAddMore={canAddAnyBlock(blocks, canvasSize)}
            />
            <BlockPropertiesPanel
              block={blocks.find((b) => b.id === selectedBlockId) ?? null}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
            />
          </DndContext>
        ) : (
          <div className="flex flex-1 animate-pulse items-center justify-center bg-zinc-100/50 dark:bg-zinc-800/30">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading designer…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

export function loadTemplatesFromStorage(): ReportTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
