"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Download, Eraser, PanelLeftClose, PanelLeftOpen, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Pedagogical Discussion",
      lastMessageSnippet: "Empty conversation started",
      updatedAt: "Just now",
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
    toast.success("Conversation removed");
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
            title: currentTitle || s.title,
            lastMessageSnippet: textToSend.substring(0, 60),
            updatedAt: "Just now",
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

      if (queryLower.includes("syllabus") || queryLower.includes("course") || queryLower.includes("curriculum")) {
        assistantReplyContent = `### Generated Pedagogical Syllabus Breakdown

**Title**: Advanced Technical Curriculum Synthesis
**Target Level**: Master (Bac+5) | **ECTS**: 6 Credits | **Accreditation**: RNCP Level 7

---

#### 1. Core Competencies & Learning Outcomes
- Master scalable software paradigms, domain invariants, and asynchronous worker queues.
- Implement production-grade testing matrices and CI/CD automated validation.

#### 2. Modular Structure
- **Module 1**: Hexagonal Architecture, Domain Aggregates & Dependency Injection (12h)
- **Module 2**: Event Bus, Topic Routing & Asynchronous Message Processing (12h)
- **Module 3**: Resilient Multi-Tenant Schema Storage & Data Isolation (12h)
- **Module 4**: Telemetry, OpenTelemetry Metrics & Production Hardening (12h)

#### 3. Continuous Assessment Matrix
- 40% Continuous Laboratory Exercises
- 60% Final Defended Capstone Project`;

        actions = [
          { label: "Open in Document Studio", actionKey: "open-doc-designer", variant: "default" },
          { label: "Export to Catalog", actionKey: "export-catalog", variant: "secondary" },
        ];
      } else if (queryLower.includes("risk") || queryLower.includes("retention") || queryLower.includes("student")) {
        assistantReplyContent = `### Predictive Retention Diagnostic Report

**Target Cohort**: Active Enrollment Telemetry
**Risk Indicators**: Absence Frequency, Evaluation Delta, Lab Commit Velocity

---

#### Key Telemetric Findings
1. **Critical Drop Alerts**: 2 learners exhibit risk factor scores > 70% due to concurrent assessment deficits and absence clustering.
2. **Pedagogical Action Pathway**:
   - Schedule one-on-one pedagogical mentoring sessions within 48 hours.
   - Dispatch structured catch-up modules through the Remediation engine.
   - Archive evidence for OPCO and apprenticeship contract compliance.`;

        actions = [
          { label: "View Remediation Board", actionKey: "open-remediation", variant: "default" },
          { label: "Send Tutor Notifications", actionKey: "send-alerts", variant: "outline" },
        ];
      } else if (queryLower.includes("qualiopi") || queryLower.includes("audit") || queryLower.includes("indicator")) {
        assistantReplyContent = `### Qualiopi Quality Standard Compliance Assessment

**Focus Criteria**: Category 4 & 6 (Pedagogical Resources & Trainer Competence)

---

#### Compliance Matrix Checklist
- [x] **Indicator 21**: All trainers possess certified professional credentials aligned with syllabus.
- [x] **Indicator 22**: Educational cloud environments and LMS accounts provisioned before Day 1.
- [x] **Indicator 26**: Disability reference framework and accessible course materials validated.

**Recommendation**: Ensure all quarterly attendance sheets bear digital SHA-256 verification seals.`;

        actions = [{ label: "Open Document Studio", actionKey: "open-doc-designer", variant: "default" }];
      } else {
        assistantReplyContent = `### Pedagogical Copilot Analysis

I have processed your query against the institutional educational ontology and center guidelines:

1. **Strategic Alignment**: Recommendations align with ECTS credit structures, RNCP competency standards, and multi-tenant isolation rules.
2. **Actionable Step**: You can convert this specification into official PDF/Excel templates or register it directly into the curriculum repository.`;

        actions = [{ label: "Open Document Studio", actionKey: "open-doc-designer", variant: "default" }];
      }

      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: assistantReplyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metadata: {
          model: selectedModel,
          tokensUsed: Math.floor(Math.random() * 300) + 350,
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
    }, 900);
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
        toast.success("Mentoring alerts dispatched to cohort tutors and administration.");
        break;
      default:
        toast.info(`Action triggered: ${actionKey}`);
    }
  };

  const handleClearCurrentChat = () => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [],
            lastMessageSnippet: "Conversation cleared",
          };
        }
        return s;
      }),
    );
    toast.success("Chat history cleared for this session");
  };

  const handleExportTranscript = () => {
    if (!activeSession || activeSession.messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    const transcript = activeSession.messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join("\n---\n\n");

    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pedagogical-ai-session-${activeSession.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col space-y-3">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight">Onixe Pedagogical Copilot</h1>
              <p className="text-[11px] text-muted-foreground">
                Domain-specific educational reasoning, syllabus synthesis, and telemetry diagnosis
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-[11px] text-muted-foreground">Model:</span>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-8 w-[230px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Onixe Pedagogical Copilot v2.4">Onixe Copilot v2.4 (Recommended)</SelectItem>
                <SelectItem value="Deep Academic Reasoner">Deep Academic Reasoner</SelectItem>
                <SelectItem value="Curriculum Synthesizer (ECTS/RNCP)">Curriculum Synthesizer (ECTS)</SelectItem>
                <SelectItem value="Qualiopi Quality Inspector">Qualiopi Quality Inspector</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleExportTranscript}
            disabled={!activeSession || activeSession.messages.length === 0}
          >
            <Download className="size-3.5" />
            Export
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground text-xs hover:text-destructive"
            onClick={handleClearCurrentChat}
            disabled={!activeSession || activeSession.messages.length === 0}
          >
            <Eraser className="size-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Main Workspace with Sidebar + Chat Panel */}
      <Card className="flex flex-1 overflow-hidden border shadow-xs">
        {/* Left Sidebar (Chat History) */}
        {isSidebarOpen && (
          <div className="w-72 shrink-0 md:w-80">
            <AiChatHistory
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession}
            />
          </div>
        )}

        {/* Right Main Chat Panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          {/* Messages Scroll Area */}
          <ScrollArea className="flex-1">
            <AiChatMessages
              messages={activeSession?.messages || []}
              isStreaming={isStreaming}
              onSelectPromptStarter={handleSelectPromptStarter}
              onActionClick={handleActionClick}
            />
          </ScrollArea>

          {/* Prompt Preset Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-t bg-muted/10 px-4 py-2 text-xs">
            <span className="shrink-0 font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
              Quick Topics:
            </span>
            {PROMPT_STARTERS.map((p) => (
              <Badge
                key={p.id}
                variant="outline"
                className="cursor-pointer whitespace-nowrap bg-background text-[11px] hover:border-primary/40 hover:bg-accent/40"
                onClick={() => handleSelectPromptStarter(p)}
              >
                {p.title}
              </Badge>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="border-t bg-card p-3 md:p-4">
            <div className="relative rounded-xl border bg-background p-2 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20">
              <Textarea
                placeholder="Ask pedagogical copilot (e.g. Generate syllabus for Cloud & DevOps Master, analyze high-risk learners, audit Qualiopi standard)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                className="resize-none border-0 p-1 text-xs shadow-none focus-visible:ring-0"
              />

              <div className="mt-2 flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Badge variant="secondary" className="h-5 text-[10px]">
                    Shift + Enter for new line
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isStreaming}
                    size="sm"
                    className="h-7 gap-1.5 px-3 text-xs"
                  >
                    <span>Send</span>
                    <Send className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
