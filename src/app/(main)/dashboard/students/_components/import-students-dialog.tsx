"use client";

import * as React from "react";

import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/lib/i18n/i18n-context";

import type { StudentItem } from "./data";
import { type CreateStudentPayload, createBulkStudentsApi } from "./students.api";

interface ParsedStudentRow {
  matricule?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  department: string;
  cohort: string;
  guardianName?: string;
  guardianEmail?: string;
  avatar?: string;
  isValid: boolean;
  validationError?: string;
}

interface ImportStudentsDialogProps {
  onStudentsImported: (newStudents: StudentItem[]) => void;
}

function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ImportStudentsDialog({ onStudentsImported }: ImportStudentsDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [isParsing, setIsParsing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [parsedRows, setParsedRows] = React.useState<ParsedStudentRow[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const resetState = () => {
    setFileName(null);
    setParsedRows([]);
    setIsParsing(false);
    setIsSubmitting(false);
    const inputElement = fileInputRef.current;
    if (inputElement !== null) {
      inputElement.value = "";
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetState();
    }
  };

  const downloadSampleTemplate = () => {
    const templateData = [
      {
        Matricule: "STU-2026-101",
        Nom: "Kouassi",
        Prenom: "Jean-Marc",
        Email: "jm.kouassi@student.onixe.edu",
        Telephone: "+33 6 11 22 33 44",
        Departement: "Computer Science",
        Promotion: "Software Engineering 2026-A",
        NomTuteur: "Paul Kouassi",
        EmailTuteur: "p.kouassi@family.com",
        Photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      },
      {
        Matricule: "STU-2026-102",
        Nom: "Toure",
        Prenom: "Awa",
        Email: "awa.toure@student.onixe.edu",
        Telephone: "+33 6 55 66 77 88",
        Departement: "Security & Networks",
        Promotion: "Cybersecurity & Cloud Defense",
        NomTuteur: "Fatou Toure",
        EmailTuteur: "f.toure@family.com",
        Photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
      },
      {
        Matricule: "STU-2026-103",
        Nom: "Dupont",
        Prenom: "Claire",
        Email: "c.dupont@student.onixe.edu",
        Telephone: "+33 6 77 88 99 00",
        Departement: "Artificial Intelligence",
        Promotion: "Data Science & Applied AI",
        NomTuteur: "Michel Dupont",
        EmailTuteur: "m.dupont@family.com",
        Photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Etudiants");

    // Column widths for readability
    worksheet["!cols"] = [
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 24 },
      { wch: 32 },
      { wch: 22 },
      { wch: 28 },
    ];

    XLSX.writeFile(workbook, "Modele_Import_Etudiants_Onixe.xlsx");

    toast.success("Modèle Excel généré", {
      description: "Le fichier modèle a été téléchargé avec succès sur votre ordinateur.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    void processFile(file);
  };

  const processFile = async (file: File) => {
    setIsParsing(true);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        throw new Error("Le classeur Excel ne contient aucune feuille de calcul.");
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

      if (rawData.length === 0) {
        throw new Error("La feuille de calcul sélectionnée est vide.");
      }

      const rows: ParsedStudentRow[] = rawData.map((rawRow) => {
        const rowMapped: Record<string, string> = {};

        for (const [key, val] of Object.entries(rawRow)) {
          const normKey = normalizeKey(key);
          rowMapped[normKey] = String(val).trim();
        }

        const matricule = rowMapped.matricule || rowMapped.id || rowMapped.studentid || rowMapped.code || undefined;

        const firstName = rowMapped.prenom || rowMapped.firstname || "";
        const lastName = rowMapped.nom || rowMapped.lastname || "";

        let name = rowMapped.name || rowMapped.nomcomplet || rowMapped.fullname || "";
        if (!name && (firstName || lastName)) {
          name = `${firstName} ${lastName}`.trim();
        }

        const email = rowMapped.email || rowMapped.mail || rowMapped.courriel || rowMapped.adresseemail || "";

        const phone =
          rowMapped.telephone || rowMapped.phone || rowMapped.tel || rowMapped.contact || "+33 6 00 00 00 00";

        const department = rowMapped.departement || rowMapped.department || rowMapped.filiere || "Computer Science";

        const cohort =
          rowMapped.promotion ||
          rowMapped.promotionetudiante ||
          rowMapped.cohorte ||
          rowMapped.cohort ||
          rowMapped.classe ||
          "Software Engineering 2026-A";

        const guardianName =
          rowMapped.nomtuteur || rowMapped.tuteur || rowMapped.guardianname || rowMapped.parent || undefined;

        const guardianEmail = rowMapped.emailtuteur || rowMapped.guardianemail || rowMapped.mailtuteur || undefined;

        const avatar =
          rowMapped.photo ||
          rowMapped.avatar ||
          rowMapped.image ||
          rowMapped.photourl ||
          rowMapped.urlphoto ||
          undefined;

        let isValid = true;
        let validationError: string | undefined;

        if (!name) {
          isValid = false;
          validationError = "Nom manquant";
        } else if (!email) {
          isValid = false;
          validationError = "Email manquant";
        } else if (!isValidEmail(email)) {
          isValid = false;
          validationError = "Format email invalide";
        }

        return {
          matricule,
          name,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          email,
          phone,
          department,
          cohort,
          guardianName,
          guardianEmail,
          avatar,
          isValid,
          validationError,
        };
      });

      setParsedRows(rows);
      toast.success("Fichier Excel analysé", {
        description: `${rows.filter((r) => r.isValid).length} étudiants valides détectés sur ${rows.length} lignes.`,
      });
    } catch (err) {
      toast.error("Erreur de lecture du fichier", {
        description: err instanceof Error ? err.message : String(err),
      });
      setFileName(null);
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const validRows = parsedRows.filter((r) => r.isValid);
  const invalidRows = parsedRows.filter((r) => !r.isValid);

  const handleSubmitImport = async () => {
    if (validRows.length === 0) {
      toast.error("Aucun apprenant valide", {
        description: "Vérifiez que votre fichier contient au moins un étudiant avec nom et email valides.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payloads: CreateStudentPayload[] = validRows.map((r) => ({
        matricule: r.matricule,
        name: r.name,
        email: r.email,
        phone: r.phone,
        department: r.department,
        cohort: r.cohort,
        guardianName: r.guardianName,
        guardianEmail: r.guardianEmail,
        avatar: r.avatar,
        status: "Active",
      }));

      const createdStudents = await createBulkStudentsApi(payloads);
      onStudentsImported(createdStudents);

      toast.success("Importation réussie", {
        description: `${createdStudents.length} apprenants ont été inscrits avec succès dans le registre.`,
      });
      setOpen(false);
      resetState();
    } catch (err) {
      toast.error("Échec de l'importation", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("students.importExcelButton", "Importer depuis Excel")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl sm:max-w-5xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg">
                  {t("students.importModalTitle", "Importation Massive d'Étudiants")}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {t(
                    "students.importModalDesc",
                    "Importez plusieurs apprenants simultanément via une feuille Excel (.xlsx, .xls) ou un fichier CSV.",
                  )}
                </DialogDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={downloadSampleTemplate} className="gap-1.5 text-xs">
              <Download className="size-3.5" />
              <span>{t("students.downloadTemplate", "Télécharger le modèle Excel")}</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dropzone */}
          {parsedRows.length === 0 ? (
            <button
              type="button"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-muted-foreground/25 border-dashed bg-muted/20 px-6 py-10 transition-colors hover:border-primary/50 hover:bg-muted/40"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isParsing ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
              </div>
              <div className="mt-3 text-center">
                <p className="font-medium text-sm">
                  {t("students.dropzoneTitle", "Glissez votre fichier Excel ici, ou cliquez pour parcourir")}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  {t(
                    "students.dropzoneSubtitle",
                    "Formats acceptés : .xlsx, .xls, .csv (Max 10 Mo) — Prise en charge des colonnes : Nom, Prénom, Email, Téléphone, Département, Promotion, Tuteur et Photo/Avatar.",
                  )}
                </p>
              </div>
            </button>
          ) : (
            <div className="space-y-3">
              {/* File Info Bar */}
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">{fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="mr-1 size-3" />
                    {validRows.length} {t("students.validRows", "valides")}
                  </Badge>
                  {invalidRows.length > 0 && (
                    <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                      <AlertCircle className="mr-1 size-3" />
                      {invalidRows.length} {t("students.invalidRows", "invalides")}
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon-xs" onClick={resetState} title="Changer de fichier">
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Data Preview Table */}
              <ScrollArea className="h-72 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">Statut</TableHead>
                      <TableHead className="w-12">Photo</TableHead>
                      <TableHead>{t("students.tableMatricule", "Matricule")}</TableHead>
                      <TableHead>{t("students.tableName", "Nom complet")}</TableHead>
                      <TableHead>{t("students.tableEmail", "Email")}</TableHead>
                      <TableHead>{t("students.tableDept", "Département")}</TableHead>
                      <TableHead>{t("students.tableCohort", "Promotion")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row, idx) => (
                      <TableRow key={`row-${row.email || idx}`} className={!row.isValid ? "bg-destructive/5" : ""}>
                        <TableCell>
                          {row.isValid ? (
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <span title={row.validationError}>
                              <AlertCircle className="size-4 text-destructive" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Avatar className="size-8 border border-border/60">
                            {row.avatar && <AvatarImage src={row.avatar} alt={row.name} />}
                            <AvatarFallback className="font-semibold text-[10px]">
                              {row.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {row.matricule || <span className="text-muted-foreground italic">Auto</span>}
                        </TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-xs">{row.email}</TableCell>
                        <TableCell className="text-xs">{row.department}</TableCell>
                        <TableCell className="text-xs">{row.cohort}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t("common.cancel", "Annuler")}
          </Button>
          <Button onClick={handleSubmitImport} disabled={validRows.length === 0 || isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            <span>
              {t("students.importAction", "Importer les apprenants valides")} ({validRows.length})
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
