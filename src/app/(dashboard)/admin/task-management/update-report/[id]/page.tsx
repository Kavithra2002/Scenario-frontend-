"use client";

import { useRouter, useParams } from "next/navigation";
import { ReportBuilder } from "@/components/report-builder";
import type { ReportDefinition } from "@/components/report-builder";

// Mock: replace with real fetch by id (e.g. useEffect + API call)
function useReport(id: string | null): ReportDefinition | undefined {
  if (!id) return undefined;
  // TODO: fetch report by id from API; for now return stub so builder loads
  return {
    id,
    name: "Untitled Report",
    canvasSize: "A4",
    blocks: [],
  };
}

export default function UpdateReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;
  const initialReport = useReport(id);

  const handleSave = (report: ReportDefinition) => {
    // TODO: call API to update report, then redirect
    console.log("Save report (update):", report);
    router.push("/admin/task-management");
  };

  const handleExportPdf = (report: ReportDefinition) => {
    // TODO: generate and download PDF
    console.log("Export as PDF:", report);
  };

  if (id && !initialReport) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        Loading report…
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ReportBuilder
        initialReport={initialReport}
        mode="update"
        backHref="/admin/task-management"
        onSave={handleSave}
        onExportPdf={handleExportPdf}
      />
    </div>
  );
}
