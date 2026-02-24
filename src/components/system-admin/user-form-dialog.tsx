"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createUser,
  updateUser,
  type SystemAdminUser,
  type CreateUserPayload,
} from "@/lib/system-admin-api";
import { UserRole } from "@/types/roles";

const ROLES: UserRole[] = ["user", "admin", "system-admin", "authorizer"];

const emptyForm: CreateUserPayload & { password?: string } = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  role: "user",
  password: "",
};

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, dialog is in edit mode and form is pre-filled. */
  user: SystemAdminUser | null;
  onSuccess: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const isEdit = !!user;
  const [form, setForm] = useState<CreateUserPayload & { password?: string }>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (user) {
        setForm({
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email ?? "",
          contact: user.contact ?? "",
          role: (user.role as UserRole) ?? "user",
          password: "",
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, user]);

  const updateField = (key: keyof CreateUserPayload | "password", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = isEdit
        ? await updateUser({ ...form, id: user.id })
        : await createUser({ ...form, password: form.password || undefined });
      if (result.success) {
        onOpenChange(false);
        onSuccess();
      } else {
        setError(result.message ?? "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update user" : "Add user"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit the user details below."
              : "Enter the new user details. The user will be created in the system and can sign in with the email and password you set."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="user-firstName"
                className="text-sm font-medium leading-none"
              >
                First name
              </label>
              <Input
                id="user-firstName"
                value={form.firstName ?? ""}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="user-lastName"
                className="text-sm font-medium leading-none"
              >
                Last name
              </label>
              <Input
                id="user-lastName"
                value={form.lastName ?? ""}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="user-email"
              className="text-sm font-medium leading-none"
            >
              Email
            </label>
            <Input
              id="user-email"
              type="email"
              value={form.email ?? ""}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="user-contact"
              className="text-sm font-medium leading-none"
            >
              Contact
            </label>
            <Input
              id="user-contact"
              value={form.contact ?? ""}
              onChange={(e) => updateField("contact", e.target.value)}
              placeholder="Phone or contact"
            />
          </div>
          {!isEdit && (
            <div className="space-y-2">
              <label
                htmlFor="user-password"
                className="text-sm font-medium leading-none"
              >
                Initial password
              </label>
              <Input
                id="user-password"
                type="password"
                value={form.password ?? ""}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Set password for first sign-in"
                required={!isEdit}
                autoComplete="new-password"
              />
            </div>
          )}
          <div className="space-y-2">
            <label
              htmlFor="user-role"
              className="text-sm font-medium leading-none"
            >
              Role
            </label>
            <select
              id="user-role"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="border-input bg-background focus:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus:ring-2 focus:ring-offset-2"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Update user" : "Add user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
