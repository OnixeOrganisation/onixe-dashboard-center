"use client";

import * as React from "react";

import {
  Building2,
  DoorOpen,
  Layers,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  type AllocateClassroomPayload,
  allocateClassroomApi,
  type CreateCampusPayload,
  createCampusApi,
  fetchCampuses,
  updateClassroomStatusApi,
} from "./campuses.api";
import { CreateCampusDialog } from "./create-campus-dialog";
import { CreateClassroomDialog } from "./create-classroom-dialog";
import type { CampusItem, ClassroomItem } from "./data";

export function CampusesList() {
  const [campuses, setCampuses] = React.useState<CampusItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCampus, setSelectedCampus] = React.useState<CampusItem | null>(null);
  const [roomDialogOpen, setRoomDialogOpen] = React.useState(false);

  const loadData = React.useCallback(async (showToast = false) => {
    try {
      const data = await fetchCampuses();
      setCampuses(Array.isArray(data) ? data : []);
      if (showToast) {
        toast.success("Campuses synchronisés", {
          description: "Données des campus et salles récupérées en direct depuis le serveur NestJS.",
        });
      }
    } catch (err) {
      toast.error("Impossible de charger les campus", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData(false);
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true);
  };

  const handleAddCampus = async (payload: CreateCampusPayload): Promise<boolean> => {
    try {
      const created = await createCampusApi(payload);
      setCampuses((prev) => [created, ...prev]);
      toast.success("Campus créé avec succès", {
        description: `${created.name} a été enregistré en base de données.`,
      });
      return true;
    } catch (err) {
      toast.error("Échec de création du campus", {
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  };

  const handleAddClassroom = async (campusId: string, payload: AllocateClassroomPayload): Promise<boolean> => {
    try {
      const updatedCampus = await allocateClassroomApi(campusId, payload);
      setCampuses((prev) => prev.map((c) => (c.id === campusId ? updatedCampus : c)));
      toast.success("Salle allouée avec succès", {
        description: `${payload.name} a été enregistrée en base de données.`,
      });
      return true;
    } catch (err) {
      toast.error("Échec de l'allocation de salle", {
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  };

  const handleClassroomStatusChange = async (campusId: string, roomId: string, status: ClassroomItem["status"]) => {
    try {
      const updatedCampus = await updateClassroomStatusApi(campusId, roomId, status);
      setCampuses((prev) => prev.map((c) => (c.id === campusId ? updatedCampus : c)));
      toast.success("Statut de la salle mis à jour", {
        description: `Statut modifié avec succès en ${status}.`,
      });
    } catch (err) {
      toast.error("Erreur de mise à jour du statut", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const allClassrooms = React.useMemo(() => {
    return campuses.flatMap((c) =>
      c.classrooms.map((room) => ({
        ...room,
        campusName: c.name,
        campusCode: c.code,
      })),
    );
  }, [campuses]);

  const filteredCampuses = campuses.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });

  const filteredClassrooms = allClassrooms.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.campusName.toLowerCase().includes(q)
    );
  });

  const totalCapacity = campuses.reduce((acc, c) => acc + c.totalCapacity, 0);
  const totalClassrooms = campuses.reduce((acc, c) => acc + c.classroomsCount, 0);
  const activeCohorts = campuses.reduce((acc, c) => acc + c.activeCohortsCount, 0);

  const getStatusBadgeClass = (status: ClassroomItem["status"]) => {
    if (status === "Available") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "In Session") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Campuses & Classrooms</h1>
          <p className="text-muted-foreground text-sm">
            Manage physical tech campuses, virtual cloud learning spaces, computer labs, and seating capacities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="h-9 gap-2"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <CreateCampusDialog onAddCampus={handleAddCampus} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Total Campus Sites
            </span>
            <Building2 className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{campuses.length}</div>
          <div className="mt-1 text-muted-foreground text-xs">Physical & Virtual Hybrid</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Classrooms & Labs
            </span>
            <DoorOpen className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalClassrooms}</div>
          <div className="mt-1 text-muted-foreground text-xs">Amphitheatres, Labs, Studios</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Seating Capacity</span>
            <Users className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalCapacity}</div>
          <div className="mt-1 text-muted-foreground text-xs">Simultaneous learner capacity</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Active Promotions
            </span>
            <Layers className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{activeCohorts}</div>
          <div className="mt-1 text-muted-foreground text-xs">Across all learning spaces</div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="campuses" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="campuses" className="text-xs">
              Campus Sites ({campuses.length})
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="text-xs">
              All Rooms & Labs ({allClassrooms.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative min-w-[240px]">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search campuses, labs, locations..."
              className="h-9 pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground text-xs">Loading campus infrastructure catalogue...</p>
          </div>
        ) : (
          <>
            {/* Campuses View */}
            <TabsContent value="campuses" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCampuses.map((campus) => (
                  <Card key={campus.id} className="flex flex-col justify-between">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-bold font-mono text-xs">
                              {campus.code}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {campus.type}
                            </Badge>
                          </div>
                          <CardTitle className="pt-1 text-lg">{campus.name}</CardTitle>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Campus Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCampus(campus);
                                setRoomDialogOpen(true);
                              }}
                            >
                              Add Classroom / Lab
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {campus.address}, {campus.city} ({campus.country})
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pb-4">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-md border bg-muted/20 p-2">
                          <div className="text-[11px] text-muted-foreground">Classrooms</div>
                          <div className="mt-0.5 font-bold text-base">{campus.classroomsCount}</div>
                        </div>
                        <div className="rounded-md border bg-muted/20 p-2">
                          <div className="text-[11px] text-muted-foreground">Capacity</div>
                          <div className="mt-0.5 font-bold text-base">{campus.totalCapacity}</div>
                        </div>
                        <div className="rounded-md border bg-muted/20 p-2">
                          <div className="text-[11px] text-muted-foreground">Cohorts</div>
                          <div className="mt-0.5 font-bold text-base">{campus.activeCohortsCount}</div>
                        </div>
                      </div>

                      <div className="space-y-2 border-t pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">Learning Spaces</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 gap-1 px-2 text-[11px]"
                            onClick={() => {
                              setSelectedCampus(campus);
                              setRoomDialogOpen(true);
                            }}
                          >
                            <Plus className="size-3" />
                            Add Room
                          </Button>
                        </div>

                        <div className="space-y-1.5">
                          {campus.classrooms.slice(0, 3).map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center justify-between rounded-md border p-2 text-xs transition-colors hover:bg-muted/30"
                            >
                              <div className="grid gap-0.5">
                                <span className="font-medium text-foreground">{r.name}</span>
                                <span className="text-[11px] text-muted-foreground">
                                  {r.type} • {r.capacity} seats • {r.floor}
                                </span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 p-0 hover:bg-transparent">
                                    <Badge
                                      variant="secondary"
                                      className={`cursor-pointer text-[10px] ${getStatusBadgeClass(r.status)}`}
                                    >
                                      {r.status}
                                    </Badge>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleClassroomStatusChange(campus.id, r.id, "Available")}
                                  >
                                    Available
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleClassroomStatusChange(campus.id, r.id, "In Session")}
                                  >
                                    In Session
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleClassroomStatusChange(campus.id, r.id, "Maintenance")}
                                  >
                                    Maintenance
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                          {campus.classrooms.length > 3 && (
                            <div className="pt-1 text-center text-[11px] text-muted-foreground">
                              +{campus.classrooms.length - 3} more learning spaces
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Classrooms Inventory Table View */}
            <TabsContent value="classrooms">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Rooms & Computing Laboratories</CardTitle>
                  <CardDescription className="text-xs">
                    Comprehensive inventory of amphitheatres, GPU machine learning labs, and lecture spaces.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y border-t">
                    {filteredClassrooms.map((room) => (
                      <div
                        key={room.id}
                        className="flex flex-col gap-3 p-4 text-xs sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/40 font-bold font-mono text-xs">
                            {room.code.slice(0, 4)}
                          </div>
                          <div className="grid gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-sm">{room.name}</span>
                              <Badge variant="outline" className="font-mono text-[10px]">
                                {room.code}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {room.campusName} • {room.floor}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                          <div className="text-right">
                            <div className="font-semibold text-foreground">{room.capacity} seats</div>
                            <div className="text-[11px] text-muted-foreground">{room.type}</div>
                          </div>

                          <div className="flex max-w-[220px] flex-wrap gap-1">
                            {room.equipment.slice(0, 2).map((eq) => (
                              <Badge key={eq} variant="secondary" className="py-0 text-[10px]">
                                {eq}
                              </Badge>
                            ))}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Badge
                                  variant="secondary"
                                  className={`cursor-pointer ${getStatusBadgeClass(room.status)}`}
                                >
                                  {room.status}
                                </Badge>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleClassroomStatusChange(room.campusId, room.id, "Available")}
                              >
                                Available
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleClassroomStatusChange(room.campusId, room.id, "In Session")}
                              >
                                In Session
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleClassroomStatusChange(room.campusId, room.id, "Maintenance")}
                              >
                                Maintenance
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Modal */}
      <CreateClassroomDialog
        campus={selectedCampus}
        open={roomDialogOpen}
        onOpenChange={setRoomDialogOpen}
        onAddClassroom={handleAddClassroom}
      />
    </div>
  );
}
