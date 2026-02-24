"use client";

import type { ComponentType } from "react";
import type { BlockType } from "./types";
import {
  Type,
  AlignLeft,
  Table2,
  BarChart3,
  TrendingUp,
  Image,
  Minus,
} from "lucide-react";

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: ComponentType<{ className?: string }>;
  defaultProps: Record<string, unknown>;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: "title",
    label: "Title",
    icon: Type,
    defaultProps: {
      content: "",
      level: 1,
      width: "100%",
      height: "auto",
      positionX: 0,
    },
  },
  {
    type: "text",
    label: "Text",
    icon: AlignLeft,
    defaultProps: {
      content: "",
      width: "100%",
      height: "auto",
      positionX: 0,
    },
  },
  {
    type: "table",
    label: "Table",
    icon: Table2,
    defaultProps: {
      label: "",
      width: "100%",
      height: "auto",
      positionX: 0,
    },
  },
  {
    type: "chart",
    label: "Chart",
    icon: BarChart3,
    defaultProps: {
      label: "",
      width: "100%",
      height: "240px",
      positionX: 0,
    },
  },
  {
    type: "kpi",
    label: "KPI",
    icon: TrendingUp,
    defaultProps: {
      label: "",
      value: "—",
      width: "100%",
      height: "auto",
      positionX: 0,
    },
  },
  {
    type: "image",
    label: "Image",
    icon: Image,
    defaultProps: {
      url: "",
      alt: "",
      width: "100%",
      height: "200px",
      positionX: 0,
    },
  },
  {
    type: "divider",
    label: "Divider",
    icon: Minus,
    defaultProps: {
      width: "100%",
      height: "auto",
      positionX: 0,
    },
  },
];

export function getBlockDefinition(
  type: BlockType
): BlockDefinition | undefined {
  return BLOCK_DEFINITIONS.find((d) => d.type === type);
}
