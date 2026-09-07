"use client";

import { Clock, KeyRound, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { StaffItem } from "./data";

interface StaffDetailsDialogProps {
  staff: StaffItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleStatus: (id: string, newStatus: StaffItem["status"]) => void;
}

export function StaffDetailsDialog({ staff, open, onOpenChange, onToggleStatus }: StaffDetailsDialogProps) {
  if (!staff) return null;

  const getStatusBadgeClass = (status: StaffItem["status"]) => {
    if (status === "Active") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "On Leave") {
      return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-destructive/30 bg-destructive/10 text-destructive";
  };

  const getAccessBadgeClass = (access: StaffItem["accessLevel"]) => {
    if (access === "Super Admin") {
      return "border-purple-600/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }
    if (access === "Financial Officer") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (access === "Academic Officer") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    return "border-muted bg-muted text-muted-foreground";
  };

  const handleStatusToggle = () => {
    const nextStatus: StaffItem["status"] = staff.status === "Active" ? "Suspended" : "Active";
    onToggleStatus(staff.id, nextStatus);
    toast.info("Status Updated", {
      description: `${staff.name} is now marked as ${nextStatus}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {staff.matricule}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className={getAccessBadgeClass(staff.accessLevel)}>
                {staff.accessLevel}
              </Badge>
              <Badge variant="secondary" className={getStatusBadgeClass(staff.status)}>
                {staff.status}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-xl">{staff.name}</DialogTitle>
          <DialogDescription>
            {staff.role} • {staff.department}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Overview Card */}
          <div className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
            <Avatar className="size-14">
              <AvatarFallback className="font-semibold text-base">
                {staff.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-1 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="size-3.5 text-muted-foreground" />
                {staff.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5" />
                {staff.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-3.5" />
                Last Activity: {staff.lastLogin}
              </div>
            </div>
          </div>

          {/* Granular Permissions Matrix */}
          <div className="space-y-2 rounded-lg border p-3.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
              <KeyRound className="size-3.5 text-primary" />
              Assigned Permissions & Scopes
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {staff.permissions.map((p) => (
                <Badge key={p} variant="outline" className="bg-background font-mono text-[11px]">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant={staff.status === "Active" ? "destructive" : "default"}
            size="sm"
            onClick={handleStatusToggle}
          >
            {staff.status === "Active" ? "Suspend Access" : "Reactivate Access"}
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
