"use client";

import * as React from "react";

import { Check, Copy, Mail, Sparkles, UserPlus } from "lucide-react";
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
import { CohortsApi, DepartmentsApi, StudentsApi } from "@/lib/api/center-api";
import { useTranslation } from "@/lib/i18n/i18n-context";

import type { StudentItem } from "./data";

interface CreateStudentDialogProps {
  onStudentCreated?: (student: StudentItem) => void;
}

export function CreateStudentDialog({ onStudentCreated }: CreateStudentDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [selectedCohortId, setSelectedCohortId] = React.useState("coh_001");
  const [selectedDeptId, setSelectedDeptId] = React.useState("dept_001");
  const [cohorts, setCohorts] = React.useState<Array<{ id: string; name: string }>>([]);
  const [departments, setDepartments] = React.useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = React.useState<string | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      CohortsApi.list()
        .then(setCohorts)
        .catch((err: unknown) => {
          console.error("Failed to load cohorts for student invitation:", err);
          toast.error("Impossible de charger les cohortes");
        });
      DepartmentsApi.list()
        .then(setDepartments)
        .catch((err: unknown) => {
          console.error("Failed to load departments for student invitation:", err);
          toast.error("Impossible de charger les départements");
        });
    }
  }, [open]);

  const handleCopyLink = () => {
    if (!generatedInviteLink) return;
    navigator.clipboard.writeText(generatedInviteLink);
    setHasCopied(true);
    toast.success(t("students.linkCopied", "Lien copié dans le presse-papiers !"));
    setTimeout(() => setHasCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toast.error("Veuillez renseigner le prénom, le nom et l'adresse email.");
      return;
    }

    setIsLoading(true);
    try {
      const selectedCohort = cohorts.find((c) => c.id === selectedCohortId);
      const selectedDept = departments.find((d) => d.id === selectedDeptId);

      const res = await StudentsApi.invite({
        email,
        firstName,
        lastName,
        cohortId: selectedCohortId,
        cohortName: selectedCohort ? selectedCohort.name : "Master Cloud",
        departmentId: selectedDeptId,
        departmentName: selectedDept ? selectedDept.name : "Génie Informatique",
        phone,
      });

      const inviteLink = res.inviteLink || `${window.location.origin}/invite/accept?token=${res.token || "demo"}`;
      setGeneratedInviteLink(inviteLink);

      const newStudent: StudentItem = {
        id: res.student?.id || `stu-${Date.now()}`,
        matricule: res.student?.matricule || `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
        name: `${firstName} ${lastName}`,
        email,
        phone: phone || "+225 07 00 00 00 00",
        department: selectedDept ? selectedDept.name : "Génie Informatique",
        cohort: selectedCohort ? selectedCohort.name : "Promo 2026",
        cohortId: selectedCohortId,
        enrollmentDate: new Date().toISOString().split("T")[0],
        attendanceRate: 100,
        gradeAverage: 0,
        creditsEarned: 0,
        status: "Pending Invitation",
        inviteLink,
      };

      onStudentCreated?.(newStudent);
      toast.success(t("students.inviteSuccess", "Invitation expédiée avec succès !"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inattendue lors de l'invitation";
      toast.error("Erreur lors de l'envoi de l'invitation", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setGeneratedInviteLink(null);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) handleReset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
          <UserPlus className="h-4 w-4" />
          {t("students.inviteButton", "Inviter un Étudiant")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {t("students.inviteModalTitle", "Inviter un Étudiant dans ce Centre")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "students.inviteModalDesc",
              "L'étudiant recevra un email sécurisé avec un lien d'affiliation pour rejoindre votre établissement.",
            )}
          </DialogDescription>
        </DialogHeader>

        {generatedInviteLink ? (
          <div className="space-y-4 py-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
              <h4 className="flex items-center gap-2 font-semibold text-sm">
                <Sparkles className="h-4 w-4" /> Invitation prête & expédiée !
              </h4>
              <p className="mt-1 text-xs">
                L'invitation a été envoyée par mail à <strong>{email}</strong>. Vous pouvez également copier le lien
                direct d'affiliation ci-dessous :
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Lien direct d'invitation</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={generatedInviteLink} className="bg-muted/50 font-mono text-xs" />
                <Button type="button" size="icon" variant="outline" onClick={handleCopyLink} className="shrink-0">
                  {hasCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button onClick={handleReset} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                Terminer et Fermer
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="std-first">Prénom</Label>
                <Input
                  id="std-first"
                  placeholder="ex: Amadou"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="std-last">Nom de Famille</Label>
                <Input
                  id="std-last"
                  placeholder="ex: Diop"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="std-email">Adresse E-mail</Label>
                <Input
                  id="std-email"
                  type="email"
                  placeholder="etudiant@polytech.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="std-phone">Téléphone</Label>
                <Input
                  id="std-phone"
                  placeholder="+225 07 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Département de Rattachement</Label>
                <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.length > 0 ? (
                      departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="dept_001">Génie Informatique & Cloud</SelectItem>
                        <SelectItem value="dept_002">IA & Data Science</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Promotion / Cohorte Cible</Label>
                <Select value={selectedCohortId} onValueChange={setSelectedCohortId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.length > 0 ? (
                      cohorts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="coh_001">Promo 2026 - Master Cloud</SelectItem>
                        <SelectItem value="coh_002">Promo 2026 - Bachelor Software</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1 rounded-lg border bg-muted/60 p-3 text-muted-foreground text-xs">
              <p className="font-semibold text-foreground">💡 Modèle Étudiant Multi-Centres :</p>
              <p>
                Si l'étudiant dispose déjà d'un compte sur la plateforme (affilié à un autre centre), cette invitation
                ajoutera votre centre à son profil sans supprimer ses autres inscriptions.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("common.cancel", "Annuler")}
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-emerald-600 text-white hover:bg-emerald-700">
                {isLoading ? "Expédition..." : t("students.sendInvite", "Envoyer l'invitation par e-mail")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
