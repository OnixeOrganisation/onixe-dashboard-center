"use client";

import * as React from "react";

import { Loader2, UserPlus } from "lucide-react";
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
import { UserAvatarPicker } from "@/components/ui/user-avatar-picker";

import { ACCESS_LEVELS, STAFF_DEPARTMENTS, STAFF_ROLES, type StaffItem } from "./data";
import { createStaffApi } from "./staff.api";

interface CreateStaffDialogProps {
  onAddStaff: (staff: StaffItem) => void;
}

export function CreateStaffDialog({ onAddStaff }: CreateStaffDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState<string>(STAFF_ROLES[0]);
  const [department, setDepartment] = React.useState<string>(STAFF_DEPARTMENTS[0]);
  const [accessLevel, setAccessLevel] = React.useState<StaffItem["accessLevel"]>("Operator");
  const [avatar, setAvatar] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Validation Error", {
        description: "Please provide staff member's full name and email.",
      });
      return;
    }

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

    try {
      setIsSubmitting(true);
      const created = await createStaffApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "+33 1 00 00 00 00",
        role,
        department,
        accessLevel,
        permissions: getPermissionsForAccessLevel(accessLevel),
        avatar: avatar.trim() || undefined,
      });

      onAddStaff(created);
      toast.success("Staff Member Enrolled", {
        description: `${created.name} (${created.role}) has been assigned to ${created.department}.`,
      });

      setName("");
      setEmail("");
      setPhone("");
      setAvatar("");
      setOpen(false);
    } catch (err: any) {
      toast.error("Failed to enroll staff member", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="size-4" />
          Enroll Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              Enroll Training Center Staff & Admin
            </DialogTitle>
            <DialogDescription>
              Assign operational roles, governance responsibilities, and administrative RBAC permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <UserAvatarPicker
              value={avatar}
              onChange={setAvatar}
              name={name || "Staff"}
              label="Photo de profil / Avatar du collaborateur"
              description="Importer la photo officielle du membre du personnel ou saisir une URL."
            />

            <div className="space-y-1.5">
              <Label htmlFor="staff-name">Full Name *</Label>
              <Input
                id="staff-name"
                placeholder="e.g. Catherine Delorme"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="staff-email">Institutional Email *</Label>
                <Input
                  id="staff-email"
                  type="email"
                  placeholder="c.delorme@onixe.institute"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="staff-phone">Phone Number</Label>
                <Input
                  id="staff-phone"
                  placeholder="+33 1 45 67 89 10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="staff-role">Operational Role *</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="staff-role">
                    <SelectValue placeholder="Role" />
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

              <div className="space-y-1.5">
                <Label htmlFor="staff-dept">Department *</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="staff-dept">
                    <SelectValue placeholder="Department" />
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
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staff-access">RBAC Access Level</Label>
              <Select value={accessLevel} onValueChange={(v) => setAccessLevel(v as StaffItem["accessLevel"])}>
                <SelectTrigger id="staff-access">
                  <SelectValue placeholder="Access Level" />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                "Enroll Staff & Generate Credentials"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
