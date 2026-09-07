"use client";

import * as React from "react";

import { Clock, ListPlus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CourseItem, CourseModuleItem } from "./data";

interface CourseModulesDialogProps {
  course: CourseItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateModules: (courseId: string, modules: CourseModuleItem[]) => void;
}

export function CourseModulesDialog({ course, open, onOpenChange, onUpdateModules }: CourseModulesDialogProps) {
  const [modules, setModules] = React.useState<CourseModuleItem[]>([]);
  const [newTitle, setNewTitle] = React.useState("");
  const [newHours, setNewHours] = React.useState("10");
  const [newDesc, setNewDesc] = React.useState("");

  React.useEffect(() => {
    if (course) {
      setModules(course.modules || []);
    }
  }, [course]);

  if (!course) return null;

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Validation Error", { description: "Module title is required." });
      return;
    }

    const newMod: CourseModuleItem = {
      id: `mod-${Date.now()}`,
      order: modules.length + 1,
      title: newTitle.trim(),
      hours: Number.parseInt(newHours, 10) || 10,
      description: newDesc.trim() || "Pedagogical unit and learning outcomes.",
    };

    const updated = [...modules, newMod];
    setModules(updated);
    onUpdateModules(course.id, updated);

    toast.success("Module Added", {
      description: `${newMod.title} added to ${course.code}.`,
    });

    setNewTitle("");
    setNewDesc("");
  };

  const handleRemoveModule = (modId: string) => {
    const updated = modules.filter((m) => m.id !== modId);
    setModules(updated);
    onUpdateModules(course.id, updated);
  };

  const totalModuleHours = modules.reduce((acc, m) => acc + m.hours, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {course.code}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {course.ectsCredits} ECTS Credits
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Coef {course.coefficient}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-lg">{course.title}</DialogTitle>
          <DialogDescription>
            Syllabus breakdown • {totalModuleHours}h configured of {course.totalHours}h allocated
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Add Module Form */}
          <form onSubmit={handleAddModule} className="space-y-3 rounded-lg border bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
              <ListPlus className="size-4 text-primary" />
              Add Syllabus Module
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3 space-y-1">
                <Label htmlFor="mod-title" className="text-xs">
                  Module Title *
                </Label>
                <Input
                  id="mod-title"
                  placeholder="e.g. Domain-Driven Design & Repository Patterns"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="col-span-1 space-y-1">
                <Label htmlFor="mod-hours" className="text-xs">
                  Hours
                </Label>
                <Input
                  id="mod-hours"
                  type="number"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mod-desc" className="text-xs">
                Learning Outcomes / Objectives
              </Label>
              <Input
                id="mod-desc"
                placeholder="Key competencies and practical labs covered in this module..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="sm" className="h-7 gap-1 text-xs">
                <Plus className="size-3" />
                Add Module
              </Button>
            </div>
          </form>

          {/* Modules List */}
          <div className="space-y-2">
            <div className="font-semibold text-foreground text-xs">Configured Modules ({modules.length})</div>

            <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
              {modules.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-xs">
                  No modules defined yet. Add the first syllabus unit above.
                </div>
              ) : (
                modules.map((mod, index) => (
                  <div key={mod.id} className="flex items-start justify-between rounded-lg border bg-card p-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                        {index + 1}
                      </div>
                      <div className="grid gap-1">
                        <span className="font-semibold text-foreground text-sm">{mod.title}</span>
                        <p className="text-muted-foreground text-xs leading-relaxed">{mod.description}</p>
                        <div className="flex items-center gap-2 pt-0.5 text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{mod.hours} hours of training</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveModule(mod.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close Syllabus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
