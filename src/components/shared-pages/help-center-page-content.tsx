"use client";

import { useState } from "react";
import { Search, Plus, FileCheck, MessageCircle, Star, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Plus,
    iconBg: "bg-blue-600",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  },
  {
    id: "report-management",
    title: "Report Management",
    icon: FileCheck,
    iconBg: "bg-green-600",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  },
  {
    id: "communication",
    title: "Communication & Collaboration",
    icon: MessageCircle,
    iconBg: "bg-purple-600",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  },
  {
    id: "tips",
    title: "Tips & Best Practices",
    icon: Star,
    iconBg: "bg-amber-500",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  },
] as const;

/** Shared Help Center page content — same for every user (user, admin, authorizer, system-admin). */
export function HelpCenterPageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="How can we help?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {HELP_CATEGORIES.map(({ id, title, icon: Icon, iconBg, options }) => (
          <Card key={id} className="bg-card">
            <CardContent className="px-6 py-6">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconBg} text-white`}
                >
                  <Icon className="size-5" />
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
              <ul className="space-y-2">
                {options.map((option, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="flex items-center justify-between rounded-md py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                      <span>{option}</span>
                      <ChevronRight className="size-4 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
