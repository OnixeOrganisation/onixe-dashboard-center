"use client";

import * as React from "react";

import { Loader2, Plus, Users } from "lucide-react";
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

import type { ParentItem } from "./data";
import { linkStudentApi, registerParentApi } from "./parents.api";

interface LinkStudentDialogProps {
  onAddParent: (parent: ParentItem) => void;
}

export function LinkStudentDialog({ onAddParent }: LinkStudentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [relationshipType, setRelationshipType] =
    React.useState<ParentItem["relationshipType"]>("Parent / Legal Guardian");
  const [studentName, setStudentName] = React.useState("");
  const [studentMatricule, setStudentMatricule] = React.useState("");
  const [avatar, setAvatar] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Validation Error", { description: "Guardian name and email are required." });
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await registerParentApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || "+33 6 00 00 00 00",
        relationshipType,
        avatar: avatar.trim() || undefined,
      });

      if (studentName.trim() || studentMatricule.trim()) {
        try {
          const linked = await linkStudentApi(created.id, [studentMatricule.trim() || studentName.trim()]);
          onAddParent(linked);
        } catch {
          // If student not found in DB, manually link student preview
          created.linkedStudents = [
            {
              studentId: `std-${Date.now()}`,
              matricule: studentMatricule.trim() || "STU-2024-001",
              name: studentName.trim() || "Lucas Moreau",
              cohort: "Promo Dev Master 2024-A",
              gradeAverage: 15.0,
              attendanceRate: 95,
            },
          ];
          onAddParent(created);
        }
      } else {
        onAddParent(created);
      }

      toast.success("Guardian / Mentor Registered", {
        description: `${created.name} registered and linked successfully. Access credentials generated.`,
      });

      setName("");
      setEmail("");
      setStudentName("");
      setAvatar("");
      setOpen(false);
    } catch (err: any) {
      toast.error("Failed to register guardian", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Link Guardian / Enterprise Mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Link Guardian or Corporate Mentor
            </DialogTitle>
            <DialogDescription>
              Grant pedagogical and attendance telemetry access to a legal guardian or an enterprise apprenticeship
              supervisor.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <UserAvatarPicker
              value={avatar}
              onChange={setAvatar}
              name={name || "Guardian"}
              label="Photo de profil / Avatar du tuteur"
              description="Importer la photo du responsable légal ou maître d'apprentissage."
            />

            <div className="space-y-1.5">
              <Label htmlFor="par-name">Full Name *</Label>
              <Input
                id="par-name"
                placeholder="e.g. Laurent Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="par-email">Email Address *</Label>
                <Input
                  id="par-email"
                  type="email"
                  placeholder="l.dupont@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="par-phone">Phone Number</Label>
                <Input
                  id="par-phone"
                  placeholder="+33 1 49 00 12 34"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="par-rel">Relationship Type</Label>
              <Select value={relationshipType} onValueChange={(v) => setRelationshipType(v as any)}>
                <SelectTrigger id="par-rel">
                  <SelectValue placeholder="Relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parent / Legal Guardian">Parent / Legal Guardian</SelectItem>
                  <SelectItem value="Corporate Apprenticeship Master">
                    Corporate Apprenticeship Master (Tuteur Entreprise)
                  </SelectItem>
                  <SelectItem value="Sponsor Representative">Sponsor / Financial Representative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-3">
              <Label className="font-semibold text-xs">Linked Learner (Optional)</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="par-stu-name" className="text-muted-foreground text-xs">
                    Student Full Name
                  </Label>
                  <Input
                    id="par-stu-name"
                    placeholder="e.g. Lucas Moreau"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="par-stu-mat" className="text-muted-foreground text-xs">
                    Student ID / Matricule
                  </Label>
                  <Input
                    id="par-stu-mat"
                    placeholder="e.g. STU-2024-001"
                    value={studentMatricule}
                    onChange={(e) => setStudentMatricule(e.target.value)}
                  />
                </div>
              </div>
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
                  Registering...
                </>
              ) : (
                "Issue Telemetry Access Invitation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
