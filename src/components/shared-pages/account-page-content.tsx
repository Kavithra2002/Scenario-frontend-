"use client";

import { useState } from "react";
import { Pencil, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const labelClass = "text-sm font-medium leading-none";

/** Shared Account page content — same for every user (user, admin, authorizer, system-admin). */
export function AccountPageContent() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const display = (value: string) => (value.trim() ? value : "—");

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardContent className="px-6 py-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
                U
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-1 -top-1 size-8 rounded-full"
              >
                <Pencil className="size-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold">User Name</h2>
              <p className="text-sm text-muted-foreground">Role</p>
              <Button variant="link" className="h-auto p-0 text-sm">
                <Upload className="mr-1.5 size-4" />
                Upload new photo
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Full Name
              </p>
              <p className="text-foreground">{display(fullName)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-foreground">{display(phone)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Mail</p>
              <p className="text-foreground">{display(mail)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Joined Date
              </p>
              <p className="text-foreground">{display(joinedDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Edit Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="first-name" className={labelClass}>First Name</label>
              <div className="flex items-center gap-2">
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="-"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="last-name" className={labelClass}>Last Name</label>
              <div className="flex items-center gap-2">
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="-"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-full-name" className={labelClass}>Full Name</label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-full-name"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="-"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="employee-id" className={labelClass}>Employee ID</label>
              <div className="flex items-center gap-2">
                <Input
                  id="employee-id"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="-"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="department" className={labelClass}>Department</label>
              <div className="flex items-center gap-2">
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="-"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className={labelClass}>Role</label>
              <div className="flex items-center gap-2">
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="-"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
