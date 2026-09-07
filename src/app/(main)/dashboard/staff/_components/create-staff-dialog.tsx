"use client";

import * as React from "react";

import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ACCESS_LEVELS, STAFF_DEPARTMENTS, STAFF_ROLES, type StaffItem } from "./data";

interface CreateStaffDialogProps {
  onAddStaff: (staff: StaffItem) => void;
}

export function CreateStaffDialog({ onAddStaff }: CreateStaffDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState<string>(STAFF_ROLES[0]);
  const [department, setDepartment] = React.useState<string>(STAFF_DEPARTMENTS[0]);
  const [accessLevel, setAccessLevel] = React.useState<StaffItem["accessLevel"]>("Operator");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Validation Error", {
        description: "Please provide staff member's full name and email.",
      });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const getPermissionsForAccessLevel = (level: StaffItem["accessLevel"]): string[] => {
      if (level === "Super Admin") {
        return ["org:manage", "centre:full_access", "users:all"];
      }
      if (level === "Financial Officer") {
        return ["tuition:manage", "invoices:generate", "receipts:issue"];
      }
      if (level === "Academic Officer") {
        return ["cohorts:manage", "timetable:edit", "transcripts:sign"];
      }
      return ["students:view", "attendance:record"];
    };

    const newStaff: StaffItem = {
      id: `stf-${Date.now()}`,
      matricule: `STF-2024-${randomNum}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+33 1 00 00 00 00",
      role,
      department,
      accessLevel,
      status: "Active",
      lastLogin: "Never logged in",
      joinedDate: new Date().toISOString().split("T")[0],
      permissions: getPermissionsForAccessLevel(accessLevel),
    };

    onAddStaff(newStaff);
    toast.success("Staff Member Registered", {
      description: `${newStaff.name} appointed as ${newStaff.role}.`,
    });

    setName("");
    setEmail("");
    setPhone("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="size-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Register Center Staff & Administration</DialogTitle>
            <DialogDescription>
              Grant system access to administrative personnel, financial officers, and campus coordinators.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="stf-name">Full Name *</Label>
                <Input
                  id="stf-name"
                  placeholder="e.g. Catherine Delorme"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stf-email">Work Email *</Label>
                <Input
                  id="stf-email"
                  type="email"
                  placeholder="name@onixe.institute"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="stf-phone">Phone</Label>
                <Input
                  id="stf-phone"
                  placeholder="+33 1 45 67 89 10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stf-role">Role / Position</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="stf-role">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="stf-dept">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="stf-dept">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stf-access">Access Level</Label>
                <Select value={accessLevel} onValueChange={(v) => setAccessLevel(v as StaffItem["accessLevel"])}>
                  <SelectTrigger id="stf-access">
                    <SelectValue placeholder="Select Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_LEVELS.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Staff Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
