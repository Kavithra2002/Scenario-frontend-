"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Download,
  Plus,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchUserList,
  exportUsers,
  type SystemAdminUser,
  type UserListFilters,
} from "@/lib/system-admin-api";
import { UserFormDialog } from "./user-form-dialog";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="font-medium text-muted-foreground">
        No user data available
      </p>
      <p className="text-sm text-muted-foreground">
        Data will appear here once loaded from the backend
      </p>
    </div>
  );
}

export function UserListContent() {
  const [users, setUsers] = useState<SystemAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<UserListFilters>({});
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemAdminUser | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUserList(filters);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  // Stable ref so dependency array size stays constant (avoids React "changed size" error)
  const mountRef = useRef(null);
  useEffect(() => {
    loadUsers();
    // When backend is ready, add filters and use [mountRef, filters]
  }, [mountRef]);

  const handleExport = async () => {
    try {
      const blob = await exportUsers(filters);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users-export.csv";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Backend not wired yet
    }
  };

  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(search.toLowerCase()) ||
          u.lastName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFilters((f) => ({ ...f }))}
          >
            Filter
          </Button>
          <Button onClick={handleExport}>
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 space-y-0 pb-4">
          <CardTitle className="text-lg">Showing user list</CardTitle>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-initial">
            <div className="relative w-full min-w-[200px] sm:w-auto">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search User"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => { setEditingUser(null); setUserDialogOpen(true); }}>
              <Plus className="size-4" />
              Add User
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingUser(null);
                setUserDialogOpen(true);
              }}
            >
              <RefreshCw className="size-4" />
              Update User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[60px]">Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24">
                      <div className="flex items-center justify-center text-muted-foreground">
                        Loading…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24">
                      <EmptyState />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-muted-foreground">
                        {user.id}
                      </TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastUpdated}
                      </TableCell>
                      <TableCell>{user.contact}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setEditingUser(user);
                                setUserDialogOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        user={editingUser}
        onSuccess={loadUsers}
      />
    </div>
  );
}
