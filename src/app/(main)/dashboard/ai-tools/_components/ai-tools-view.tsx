"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Download, Eraser, PanelLeft, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { ChatMessage, ChatSession, PromptStarter } from "../types";
import { AiChatHistory } from "./ai-chat-history";
import { AiChatMessages } from "./ai-chat-messages";
import { INITIAL_CHAT_SESSIONS, PROMPT_STARTERS } from "./data";

export function AiToolsView() {
  const router = useRouter();
  const [sessions, setSessions] = React.useState<ChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [activeSessionId, setActiveSessionId] = React.useState<string>(INITIAL_CHAT_SESSIONS[0]?.id ?? "new-1");
  const [inputText, setInputText] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("Onixe Pedagogical Copilot v2.4");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "Nouvelle Discussion",
      lastMessageSnippet: "Discussion initiée",
      updatedAt: "À l'instant",
      category: "general",
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (activeSessionId === sessionId && filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
    toast.success("Conversation supprimée");
  };

  const handleSelectPromptStarter = (starter: PromptStarter) => {
    setInputText(starter.prompt);
  };

  const handleSendMessage = (overrideText?: string) => {
    const textToSend = overrideText ?? inputText;
    if (!textToSend.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    let currentTitle = activeSession?.title;
    if (activeSession?.messages.length === 0) {
      currentTitle = textToSend.length > 35 ? `${textToSend.substring(0, 35)}...` : textToSend;
    }

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: currentTitle ?? s.title,
            lastMessageSnippet: textToSend.substring(0, 60),
            updatedAt: "À l'instant",
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      }),
    );

    setInputText("");
    setIsStreaming(true);

    // Simulate AI synthesis streaming response
    setTimeout(() => {
      let assistantReplyContent = "";
      let actions: ChatMessage["suggestedActions"] = [];

      const queryLower = textToSend.toLowerCase();

      if (queryLower.includes("syllabus") || queryLower.includes("cours") || queryLower.includes("curriculum")) {
        assistantReplyContent = `### Synthèse du Syllabus Modulaire & Compétences RNCP

**Intitulé** : Architecture Microservices Événementielles (NestJS & RabbitMQ)
**Niveau** : Master (Bac+5) | **Volume** : 48 Heures | **Crédits** : 6 ECTS

---

#### 1. Objectifs Pédagogiques & Compétences Visées
- Concevoir et implémenter une architecture microservices hexagonale résiliente.
- Déployer un bus de messages asynchrone avec gestion des files d'attente mortes (DLX) et idempotence.

#### 2. Découpage Modulaire (48h)
- **Module 1** : Clean Architecture & Modélisation du Domaine Hexagonal (12h)
- **Module 2** : Bus d'Événements & Topologies RabbitMQ (12h)
- **Module 3** : Isolation Multi-Tenant & Stratégies de Migration (12h)
- **Module 4** : Observabilité, Traçabilité OpenTelemetry & Hardening Production (12h)

#### 3. Modalités d'Évaluation
- 40% Contrôle Continu (2 Ateliers Pratiques en binôme)
- 60% Projet de Soutenance Final (Mesh de microservices déployé en environnement sandbox)`;

        actions = [
          { label: "Ouvrir dans Document Studio", actionKey: "open-doc-designer", variant: "default" },
          { label: "Exporter vers le Catalogue", actionKey: "export-catalog", variant: "secondary" },
        ];
      } else if (
        queryLower.includes("risque") ||
        queryLower.includes("retention") ||
        queryLower.includes("decrochage") ||
        queryLower.includes("étudiant")
      ) {
        assistantReplyContent = `### Rapport de Diagnostic Pédagogique & Prévention du Décrochage

**Cohorte analysée** : Promotion Dev Master 2024-A
**Signaux de télémétrie** : Taux d'assiduité, moyenne aux évaluations, fréquence de remise des labos

---

#### 1. Apprenants Identifiés en Zone Critique
- **Emma Roche (STU-2024-006)** — Score de risque : **82%**
  - Baisse de présence (-18% sur 30 jours)
  - Note d'examen à 9.1/20 en Systèmes Distribués
  - *Action recommandée* : Entretien de remédiation sous 48h & alerte tuteur entreprise.
- **Karim Belkacem (STU-2024-031)** — Score de risque : **74%**
  - Note à 7.8/20 en Deep Learning
  - 2 absences injustifiées consécutives
  - *Action recommandée* : Parrainage par un tuteur pédagogique de promotion.`;

        actions = [
          { label: "Consulter la Grille de Remédiation", actionKey: "open-remediation", variant: "default" },
          { label: "Notifier les Tuteurs", actionKey: "send-alerts", variant: "outline" },
        ];
      } else if (queryLower.includes("qualiopi") || queryLower.includes("audit") || queryLower.includes("indicateur")) {
        assistantReplyContent = `### Audit de Conformité Qualiopi : Indicateurs 21 & 22

**Référentiel National Qualité** : Catégories 4 & 6 (Ressources & Compétences Formateurs)

---

#### État des Preuves Documentaires
- [x] **Indicateur 21 (Qualifications formateurs)** : 100% des CVs et diplômes certifiés archivés dans le coffre-fort numérique.
- [x] **Indicateur 22 (Ressources & environnements)** : Espaces LMS Onixe activés avant le premier jour de cours.
- [x] **Indicateur 26 (Accessibilité)** : Protocoles d'adaptation PSH validés.

**Recommandation d'optimisation** : Vérifier que toutes les feuilles d'émargement du trimestre portent le sceau numérique SHA-256 avant inspection.`;

        actions = [{ label: "Ouvrir Document Studio", actionKey: "open-doc-designer", variant: "default" }];
      } else {
        assistantReplyContent = `### Réponse du Copilot Pédagogique

J'ai analysé votre requête au regard de la structure académique et des normes en vigueur :

1. **Alignement Académique** : Vos modules et directives sont synchronisés avec les standards ECTS et les référentiels de compétences RNCP.
2. **Action Immédiate** : Vous pouvez convertir ce contenu en document officiel (PDF/Excel) ou l'enregistrer dans vos maquettes pédagogiques.`;

        actions = [{ label: "Ouvrir Document Studio", actionKey: "open-doc-designer", variant: "default" }];
      }

      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: assistantReplyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metadata: {
          model: selectedModel,
          tokensUsed: Math.floor(Math.random() * 250) + 380,
        },
        suggestedActions: actions,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, assistantMessage],
            };
          }
          return s;
        }),
      );
      setIsStreaming(false);
    }, 850);
  };

  const handleActionClick = (actionKey: string) => {
    switch (actionKey) {
      case "open-doc-designer":
        router.push("/dashboard/document-designer");
        break;
      case "open-remediation":
        router.push("/dashboard/remediation");
        break;
      case "export-catalog":
        router.push("/centre/courses");
        break;
      case "send-alerts":
        toast.success("Alertes de remédiation envoyées aux tuteurs de promotion.");
        break;
      default:
        toast.info(`Action exécutée : ${actionKey}`);
    }
  };

  const handleClearCurrentChat = () => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [],
            lastMessageSnippet: "Discussion réinitialisée",
          };
        }
        return s;
      }),
    );
    toast.success("Historique effacé pour cette session");
  };

  const handleExportTranscript = () => {
    if (!activeSession || activeSession.messages.length === 0) {
      toast.error("Aucun message à exporter");
      return;
    }

    const transcript = activeSession.messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join("\n---\n\n");

    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pedagogical-ai-${activeSession.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Transcription téléchargée");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] w-full overflow-hidden rounded-2xl border border-border/50 bg-background shadow-xs">
      {/* Collapsible Left Sidebar */}
      {isSidebarOpen && (
        <div className="w-72 shrink-0 md:w-80">
          <AiChatHistory
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Chat Canvas */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Minimal Airy Top Navigation Bar */}
        <div className="flex h-14 items-center justify-between border-border/40 border-b px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSidebarOpen(true)}
                title="Afficher l'historique"
              >
                <PanelLeft className="size-4" />
              </Button>
            )}

            <div className="flex items-center gap-2">
              <span className="line-clamp-1 font-bold text-foreground text-sm tracking-tight">
                {activeSession?.title ?? "Onixe Pedagogical Copilot"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Selector Pill */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-8 rounded-full border-border/60 bg-muted/30 px-3 font-medium text-xs">
                <Sparkles className="mr-1.5 size-3.5 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Onixe Pedagogical Copilot v2.4">Copilot v2.4 (Recommandé)</SelectItem>
                <SelectItem value="Deep Academic Reasoner">Deep Academic Reasoner</SelectItem>
                <SelectItem value="Curriculum Synthesizer (ECTS/RNCP)">Curriculum Synthesizer (ECTS)</SelectItem>
                <SelectItem value="Qualiopi Quality Inspector">Qualiopi Inspector</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={handleExportTranscript}
              disabled={!activeSession || activeSession.messages.length === 0}
              title="Exporter la transcription"
            >
              <Download className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={handleClearCurrentChat}
              disabled={!activeSession || activeSession.messages.length === 0}
              title="Effacer les messages"
            >
              <Eraser className="size-4" />
            </Button>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <ScrollArea className="flex-1">
          <AiChatMessages
            messages={activeSession?.messages ?? []}
            isStreaming={isStreaming}
            onSelectPromptStarter={handleSelectPromptStarter}
            onActionClick={handleActionClick}
          />
        </ScrollArea>

        {/* Floating Centered Input Bar (Gemini / ChatGPT Style) */}
        <div className="mx-auto w-full max-w-3xl px-4 pt-1 pb-4">
          {/* Quick topic pills */}
          <div className="no-scrollbar mb-2.5 flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="shrink-0 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
              Suggestions :
            </span>
            {PROMPT_STARTERS.map((p) => (
              <Badge
                key={p.id}
                variant="outline"
                className="cursor-pointer whitespace-nowrap rounded-full border-border/60 bg-muted/20 px-3 py-1 font-normal text-[11px] transition-all hover:border-primary/50 hover:bg-accent/40"
                onClick={() => handleSelectPromptStarter(p)}
              >
                {p.title}
              </Badge>
            ))}
          </div>

          {/* Floating Pill Input Box */}
          <div className="relative rounded-2xl border border-border/80 bg-card/90 p-3 shadow-lg backdrop-blur-md transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
            <Textarea
              placeholder="Posez votre question pédagogique (ex: Rédiger le syllabus d'un Master Cloud & DevOps, diagnostiquer les étudiants en décrochage, préparer un audit Qualiopi)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="min-h-[56px] resize-none border-0 bg-transparent p-1.5 text-xs leading-relaxed shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 sm:text-sm"
            />

            <div className="mt-2 flex items-center justify-between border-border/40 border-t pt-2">
              <span className="text-[11px] text-muted-foreground/70">
                <kbd className="rounded border border-border/60 bg-muted/40 px-1 py-0.5 text-[10px]">Entrée</kbd> pour
                envoyer,{" "}
                <kbd className="rounded border border-border/60 bg-muted/40 px-1 py-0.5 text-[10px]">Maj + Entrée</kbd>{" "}
                pour sauter une ligne
              </span>

              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isStreaming}
                size="sm"
                className="size-8 rounded-full p-0 transition-transform active:scale-95 disabled:opacity-40"
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
