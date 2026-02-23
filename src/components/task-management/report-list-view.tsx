"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_FILTERS = [
  { id: "updating", label: "Updating", className: "bg-blue-600 hover:bg-blue-700 text-white" },
  { id: "not_started", label: "Not Started", className: "bg-amber-600 hover:bg-amber-700 text-white" },
  { id: "confirmed", label: "Confirmed", className: "bg-green-600 hover:bg-green-700 text-white" },
  { id: "rejected", label: "Rejected", className: "bg-red-600 hover:bg-red-700 text-white" },
] as const;

export interface ReportTask {
  id: string;
  reportId: string;
  reportName: string;
  status: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportListViewProps {
  /** Optional page title (e.g. "Report View") shown at the top */
  title?: string;
  /** Tasks to display; when empty, shows empty state */
  tasks?: ReportTask[];
}

export function ReportListView({ title, tasks = [] }: ReportListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {title && (
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      )}

      <Card className="bg-card">
        <CardContent className="px-6 py-4">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground shrink-0">Showing Report List</p>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Report"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
            {STATUS_FILTERS.map(({ id, label, className }) => (
              <Button
                key={id}
                variant="outline"
                size="sm"
                className={activeStatus === id ? className : undefined}
                onClick={() =>
                  setActiveStatus(activeStatus === id ? null : id)
                }
              >
                {label}
              </Button>
            ))}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <p className="font-medium">No tasks available</p>
                      <p className="text-sm">
                        Tasks will appear here once loaded from the backend.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.reportId}</TableCell>
                      <TableCell>{task.reportName}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>{task.createdAt}</TableCell>
                      <TableCell>{task.updatedAt}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
