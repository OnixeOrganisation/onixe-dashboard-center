"use client";

import * as React from "react";

import { DoorOpen } from "lucide-react";
import { toast } from "sonner";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type CampusItem, type ClassroomItem, ROOM_TYPES } from "./data";

interface CreateClassroomDialogProps {
  campus: CampusItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClassroom: (campusId: string, room: ClassroomItem) => void;
}

export function CreateClassroomDialog({ campus, open, onOpenChange, onAddClassroom }: CreateClassroomDialogProps) {
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<ClassroomItem["type"]>("Computer Lab");
  const [capacity, setCapacity] = React.useState("30");
  const [floor, setFloor] = React.useState("1st Floor");
  const [equipmentInput, setEquipmentInput] = React.useState("");

  if (!campus) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      toast.error("Validation Error", { description: "Room code and name are required." });
      return;
    }

    const equip = equipmentInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const newRoom: ClassroomItem = {
      id: `room-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      capacity: Number.parseInt(capacity, 10) || 30,
      campusId: campus.id,
      floor: floor.trim() || "Ground Floor",
      equipment: equip.length > 0 ? equip : ["Projector", "Wi-Fi 6", "Whiteboard"],
      status: "Available",
    };

    onAddClassroom(campus.id, newRoom);
    toast.success("Room Configured", {
      description: `${newRoom.name} (${newRoom.code}) has been added to ${campus.name}.`,
    });

    setCode("");
    setName("");
    setEquipmentInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DoorOpen className="size-5 text-primary" />
              Add Classroom / Laboratory
            </DialogTitle>
            <DialogDescription>Configure learning space or computing lab on {campus.name}.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="room-code">Code *</Label>
                <Input
                  id="room-code"
                  placeholder="LAB-102"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="room-name">Room / Lab Name *</Label>
                <Input
                  id="room-name"
                  placeholder="GPU Deep Learning Lab"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="room-type">Room Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as ClassroomItem["type"])}>
                  <SelectTrigger id="room-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="room-cap">Capacity (Seats)</Label>
                <Input
                  id="room-cap"
                  type="number"
                  min="1"
                  max="500"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="room-floor">Floor / Location</Label>
              <Input
                id="room-floor"
                placeholder="1st Floor - Wing B"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="room-equip">Equipment & Facilities (comma separated)</Label>
              <Input
                id="room-equip"
                placeholder="Dual Projector, 30x RTX Workstations, Gigabit LAN"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Learning Space</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
