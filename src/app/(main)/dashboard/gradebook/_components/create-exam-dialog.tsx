"use client";

import * as React from "react";

import { Award, Plus } from "lucide-react";
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
import { CohortsApi, GradebookApi } from "@/lib/api/center-api";
import { useTranslation } from "@/lib/i18n/i18n-context";

import type { ExamItem } from "./data";

interface CreateExamDialogProps {
  onAddExam: (exam: ExamItem) => void;
}

const AVAILABLE_COURSES = [
  "Architecture Microservices & Cloud Native avec NestJS",
  "Administration Cluster Kubernetes & GitOps",
  "Cybersécurité Offensive & Red Teaming",
  "Intelligence Artificielle Appliquée & PyTorch",
  "Algorithmique & Structures de Données Avancées",
];

export function CreateExamDialog({ onAddExam }: CreateExamDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [course, setCourse] = React.useState(AVAILABLE_COURSES[0]);
  const [cohorts, setCohorts] = React.useState<Array<{ id: string; name: string; enrolledStudentIds?: string[] }>>([]);
  const [selectedCohortId, setSelectedCohortId] = React.useState("coh_001");
  const [date, setDate] = React.useState("2026-11-25");
  const [time, setTime] = React.useState("09:00 - 12:00");
  const [room, setRoom] = React.useState("Amphithéâtre Nelson Mandela");
  const [examiner, _setExaminer] = React.useState("Dr. Jean-Marc Yao");
  const [type, _setType] = React.useState<ExamItem["type"]>("Final Exam");
  const [weight, setWeight] = React.useState("3");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      CohortsApi.list()
        .then((data) => {
          if (data && data.length > 0) {
            setCohorts(data);
            setSelectedCohortId(data[0].id);
          }
        })
        .catch((err: unknown) => {
          console.error("Failed to load cohorts for exam scheduling:", err);
          toast.error("Impossible de charger la liste des promotions");
        });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Veuillez saisir le titre de l'épreuve.");
      return;
    }

    const selectedCohort = cohorts.find((c) => c.id === selectedCohortId);
    const cohortName = selectedCohort ? selectedCohort.name : "Promo 2026 - Master Cloud & Microservices";

    setIsLoading(true);
    try {
      const scheduled = await GradebookApi.scheduleExam({
        cohortId: selectedCohortId,
        cohortName,
        courseId: "CS-501",
        courseTitle: course,
        title,
        examDate: date,
        room,
        weight: Number(weight) || 2,
        maxScore: 20,
      });

      const newExam: ExamItem = {
        id: scheduled.id || `exam-${Date.now()}`,
        code: `EXAM-${date.replace(/-/g, "").slice(2)}-${Math.floor(10 + Math.random() * 90)}`,
        title,
        course,
        cohort: cohortName,
        cohortId: selectedCohortId,
        date,
        time,
        durationMinutes: 120,
        room,
        examiner,
        status: "Scheduled",
        totalCandidates: selectedCohort?.enrolledStudentIds?.length || 24,
        type,
      };

      onAddExam(newExam);
      toast.success(t("gradebook.scheduleExam", "Épreuve programmée avec succès"), {
        description: `Rattachée à la cohorte "${cohortName}".`,
      });
      setOpen(false);
      setTitle("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inattendue lors de la programmation";
      toast.error("Erreur de programmation", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-emerald-600 font-medium text-white hover:bg-emerald-700">
          <Plus className="size-4" />
          {t("gradebook.scheduleExam", "Programmer une Épreuve")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Programmer une Épreuve d'Évaluation
            </DialogTitle>
            <DialogDescription>
              Toute épreuve est obligatoirement rattachée à une cohorte d'étudiants pour la saisie des notes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="exam-title">Intitulé de l'Épreuve</Label>
              <Input
                id="exam-title"
                placeholder="ex: Épreuve Finale - Systèmes Distribués"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Promotion / Cohorte Évaluée (Obligatoire)</Label>
              <Select value={selectedCohortId} onValueChange={setSelectedCohortId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une cohorte..." />
                </SelectTrigger>
                <SelectContent>
                  {cohorts.length > 0 ? (
                    cohorts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.enrolledStudentIds?.length || 0} étudiants)
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="coh_001">Promo 2026 - Master Cloud & Microservices</SelectItem>
                      <SelectItem value="coh_002">Promo 2026 - Bachelor Software Engineering</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Matière / Cours</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="exam-date">Date de l'Épreuve</Label>
                <Input id="exam-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="exam-time">Créneau Horaire</Label>
                <Input id="exam-time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="exam-room">Salle / Amphithéâtre</Label>
                <Input id="exam-room" value={room} onChange={(e) => setRoom(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="exam-weight">Coefficient</Label>
                <Input
                  id="exam-weight"
                  type="number"
                  min="1"
                  max="10"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 text-white hover:bg-emerald-700">
              {isLoading ? "Enregistrement..." : "Créer et Planifier l'Épreuve"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
