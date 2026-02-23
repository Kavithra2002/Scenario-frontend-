"use client";

import { useRouter } from "next/navigation";
import { ReportBuilder } from "@/components/report-builder";
import type { ReportDefinition } from "@/components/report-builder";

export default function UpdateReportPage() {
  const router = useRouter();

  const handleSave = (report: ReportDefinition) => {
    // TODO: call API to update report, then redirect
    console.log("Save report (update):", report);
    router.push("/admin/task-management");
  };

  const handleExportPdf = (report: ReportDefinition) => {
    // TODO: generate and download PDF
    console.log("Export as PDF:", report);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ReportBuilder
        mode="update"
        backHref="/admin/task-management"
        onSave={handleSave}
        onExportPdf={handleExportPdf}
      />
    </div>
  );
}
