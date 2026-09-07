"use client";

import * as React from "react";

import { Building2, Plus } from "lucide-react";
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

import type { CampusItem } from "./data";

interface CreateCampusDialogProps {
  onAddCampus: (campus: CampusItem) => void;
}

export function CreateCampusDialog({ onAddCampus }: CreateCampusDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<CampusItem["type"]>("Physical");
  const [city, setCity] = React.useState("");
  const [country, _setCountry] = React.useState("France");
  const [address, setAddress] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      toast.error("Validation Error", { description: "Campus code and name are required." });
      return;
    }

    const newCampus: CampusItem = {
      id: `camp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      city: city.trim() || "Remote",
      country: country.trim() || "France",
      address: address.trim() || "Main Campus Facility",
      manager: manager.trim() || "Operations Lead",
      phone: phone.trim() || "+33 1 00 00 00 00",
      totalCapacity: 0,
      classroomsCount: 0,
      activeCohortsCount: 0,
      classrooms: [],
    };

    onAddCampus(newCampus);
    toast.success("Campus Established", {
      description: `${newCampus.name} has been configured.`,
    });

    setCode("");
    setName("");
    setCity("");
    setAddress("");
    setManager("");
    setPhone("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Add Campus Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              Establish Campus Site
            </DialogTitle>
            <DialogDescription>Register a physical facility, branch, or virtual learning space.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="camp-code">Code *</Label>
                <Input
                  id="camp-code"
                  placeholder="PARIS-NORD"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="camp-name">Campus Name *</Label>
                <Input
                  id="camp-name"
                  placeholder="Paris Tech Hub Campus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="camp-type">Campus Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as CampusItem["type"])}>
                  <SelectTrigger id="camp-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physical">Physical Facility</SelectItem>
                    <SelectItem value="Virtual / Hybrid">Virtual / Hybrid Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="camp-city">City / Region</Label>
                <Input id="camp-city" placeholder="Paris" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="camp-address">Physical Address / Virtual Platform URL</Label>
              <Input
                id="camp-address"
                placeholder="e.g. 14 Rue de la Paix or https://lms.onixe.institute"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="camp-manager">Campus Director / Manager</Label>
                <Input
                  id="camp-manager"
                  placeholder="Antoine Lebrun"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="camp-phone">Contact Phone</Label>
                <Input
                  id="camp-phone"
                  placeholder="+33 1 45 67 89 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Establish Campus</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
