"use client";

import { ReportListView, type ReportTask } from "@/components/task-management/report-list-view";

export default function AuthorizerTaskManagementPage() {
  // Replace with API data when backend is ready
  const tasks: ReportTask[] = [];

  return (
    <ReportListView
      title="Report View"
      tasks={tasks}
    />
  );
}
