"use client";

import * as React from "react";

import { cn } from "cn";
import { BookOpen, Check, CheckCircle2, Copy, ExternalLink, FileText, Loader2, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { ChatMessage, PromptStarter } from "../types";
import { PROMPT_STARTERS } from "./data";

interface AiChatMessagesProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSelectPromptStarter: (prompt: PromptStarter) => void;
  onActionClick?: (actionKey: string) => void;
}

const renderActionIcon = (actionKey: string) => {
  if (actionKey === "open-doc-designer") {
    return <FileText className="size-3.5" />;
  }
  if (actionKey === "export-catalog") {
    return <BookOpen className="size-3.5" />;
  }
  return <ExternalLink className="size-3.5" />;
};

export function AiChatMessages({ messages, isStreaming, onSelectPromptStarter, onActionClick }: AiChatMessagesProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const scrollEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copié dans le presse-papier");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // If no messages yet, show welcoming Gemini-like hero interface
  if (messages.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
        {/* Gemini-style Iridescent Hero Greeting */}
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 via-purple-500/20 to-sky-500/20 shadow-sm ring-1 ring-white/10">
          <Sparkles className="size-7 text-primary" />
        </div>

        <h1 className="mt-5 font-black text-2xl tracking-tight sm:text-3xl">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-sky-500 bg-clip-text text-transparent">
            Onixe Pedagogical Copilot
          </span>
        </h1>

        <p className="mt-2 max-w-lg text-muted-foreground text-xs leading-relaxed sm:text-sm">
          Système d&apos;intelligence pédagogique pour la création de syllabus, l&apos;audit Qualiopi, le diagnostic
          prédictif d&apos;abandon et l&apos;optimisation des plannings.
        </p>

        {/* Spacious Prompt Starter Cards */}
        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
          {PROMPT_STARTERS.map((starter) => (
            <Card
              key={starter.id}
              onClick={() => onSelectPromptStarter(starter)}
              className="group cursor-pointer rounded-2xl border border-border/60 bg-card/60 p-4 text-left shadow-xs transition-all hover:border-primary/50 hover:bg-accent/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs tracking-tight transition-colors group-hover:text-primary">
                  {starter.title}
                </span>
                <Sparkles className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">{starter.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 sm:px-6">
      {messages.map((msg) => {
        const isAssistant = msg.role === "assistant";
        const isSystem = msg.role === "system";

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center">
              <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-3.5 py-1 text-muted-foreground text-xs">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>{msg.content}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={cn("flex gap-3.5 text-sm", isAssistant ? "justify-start" : "flex-row-reverse justify-end")}
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-xl shadow-xs",
                isAssistant
                  ? "bg-gradient-to-tr from-primary to-purple-600 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isAssistant ? <Sparkles className="size-4" /> : <User className="size-4" />}
            </div>

            {/* Message Body */}
            <div className={cn("max-w-2xl space-y-2", isAssistant ? "text-left" : "text-left")}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-xs">
                  {isAssistant ? "Onixe Copilot" : "Administrateur"}
                </span>
                {msg.metadata?.model && (
                  <Badge variant="outline" className="h-4 px-1.5 text-[9px] text-muted-foreground">
                    {msg.metadata.model}
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
              </div>

              {/* Message Content Container */}
              <div
                className={cn(
                  "rounded-2xl p-4 text-sm leading-relaxed shadow-xs",
                  isAssistant
                    ? "border border-border/60 bg-card text-foreground"
                    : "border border-primary/20 bg-primary/10 text-foreground",
                )}
              >
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed sm:text-sm">{msg.content}</div>

                {/* Pedagogical Action Cards Attached */}
                {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-border/40 border-t pt-3">
                    <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                      Actions Recommandées :
                    </span>
                    {msg.suggestedActions.map((action) => (
                      <Button
                        key={action.actionKey}
                        variant={action.variant ?? "outline"}
                        size="sm"
                        className="h-7 gap-1.5 rounded-lg text-xs"
                        onClick={() => onActionClick?.(action.actionKey)}
                      >
                        {renderActionIcon(action.actionKey)}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Footer Toolbar */}
              {isAssistant && (
                <div className="flex items-center gap-3 pt-0.5 text-muted-foreground text-xs">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="size-3.5 text-emerald-500" />
                        <span className="text-emerald-500 text-xs">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span className="text-xs">Copier</span>
                      </>
                    )}
                  </button>

                  {msg.metadata?.tokensUsed && (
                    <>
                      <span>•</span>
                      <span className="text-[11px]">{msg.metadata.tokensUsed} tokens</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Streaming Synthesis Indicator */}
      {isStreaming && (
        <div className="flex justify-start gap-3.5 text-sm">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-xs">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-xs">Onixe Copilot</span>
              <Badge variant="outline" className="h-4 px-1 text-[9px] text-primary">
                Génération en cours...
              </Badge>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-3.5 text-muted-foreground text-xs shadow-xs">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Analyse du référentiel pédagogique et formulation de la réponse...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
}
