"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const REPORT_STATUSES = [
  { id: "updating", label: "Updating", className: "bg-blue-600 hover:bg-blue-700 text-white" },
  { id: "not-started", label: "Not Stared", className: "bg-amber-600 hover:bg-amber-700 text-white" },
  { id: "confirmed", label: "Confirmed", className: "bg-green-600 hover:bg-green-700 text-white" },
  { id: "rejected", label: "Rejected", className: "bg-red-600 hover:bg-red-700 text-white" },
] as const;

export default function AdminTaskManagementPage() {
  const [searchReport, setSearchReport] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/task-management/create-report">
              <Plus className="mr-2 size-4" />
              Create Report
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/task-management/update-report">
              <RefreshCw className="mr-2 size-4" />
              Update Report
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="px-6 py-6">
          <h2 className="mb-4 text-lg font-medium">Showing Report List</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Report"
                value={searchReport}
                onChange={(e) => setSearchReport(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {REPORT_STATUSES.map(({ id, label, className }) => (
                <Button
                  key={id}
                  size="sm"
                  className={`${className} border-0 ${statusFilter === id ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : ""}`}
                  onClick={() => setStatusFilter(statusFilter === id ? null : id)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Report Size</TableHead>
                  <TableHead>Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <p className="text-muted-foreground font-medium">
                      No financial data available.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Data will appear here once loaded
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
