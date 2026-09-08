"use client";

import * as React from "react";

import { cn } from "cn";
import {
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";
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
    return <FileText className="size-3" />;
  }
  if (actionKey === "export-catalog") {
    return <BookOpen className="size-3" />;
  }
  return <ExternalLink className="size-3" />;
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
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // If no messages yet, show welcome view with prompt starters
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
          <Sparkles className="size-6" />
        </div>
        <h2 className="mt-4 font-bold text-lg tracking-tight">Onixe Pedagogical Copilot</h2>
        <p className="mt-1 max-w-md text-muted-foreground text-xs leading-relaxed">
          Ask for curriculum design, syllabus synthesis, retention diagnosis, Qualiopi criteria audits, or timetable
          constraint optimization.
        </p>

        <div className="mt-6 grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
          {PROMPT_STARTERS.map((starter) => (
            <Card
              key={starter.id}
              onClick={() => onSelectPromptStarter(starter)}
              className="cursor-pointer border-border/70 p-3.5 text-left transition-all hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">{starter.title}</span>
                <Sparkles className="size-3 text-muted-foreground" />
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground leading-snug">{starter.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {messages.map((msg) => {
        const isAssistant = msg.role === "assistant";
        const isSystem = msg.role === "system";

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center">
              <div className="flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-[11px] text-muted-foreground">
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>{msg.content}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={cn("flex gap-3 text-xs", isAssistant ? "justify-start" : "flex-row-reverse justify-end")}
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-lg shadow-xs",
                isAssistant ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {isAssistant ? <Bot className="size-4" /> : <User className="size-4" />}
            </div>

            {/* Message Bubble */}
            <div className={cn("max-w-2xl space-y-2", isAssistant ? "text-left" : "text-left")}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-xs">
                  {isAssistant ? "Onixe Pedagogical Copilot" : "Administrator"}
                </span>
                {msg.metadata?.model && (
                  <Badge variant="outline" className="h-4 px-1 text-[9px] text-muted-foreground">
                    {msg.metadata.model}
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
              </div>

              <div
                className={cn(
                  "rounded-xl border p-3.5 leading-relaxed shadow-xs",
                  isAssistant
                    ? "border-border/70 bg-card text-foreground"
                    : "border-primary/20 bg-primary/10 text-foreground",
                )}
              >
                {/* Render markdown-like plain text */}
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{msg.content}</div>

                {/* Actions & Tools attached to assistant reply */}
                {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 border-border/40 border-t pt-3">
                    <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                      Pedagogical Actions:
                    </span>
                    {msg.suggestedActions.map((action) => (
                      <Button
                        key={action.actionKey}
                        variant={action.variant || "outline"}
                        size="sm"
                        className="h-6 gap-1 text-[11px]"
                        onClick={() => onActionClick?.(action.actionKey)}
                      >
                        {renderActionIcon(action.actionKey)}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Footer Copy */}
              {isAssistant && (
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="size-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>

                  {msg.metadata?.tokensUsed && (
                    <>
                      <span>•</span>
                      <span>{msg.metadata.tokensUsed} tokens</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Streaming Loader */}
      {isStreaming && (
        <div className="flex justify-start gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Bot className="size-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs">Onixe Pedagogical Copilot</span>
              <Badge variant="outline" className="h-4 px-1 text-[9px] text-muted-foreground">
                Synthesizing
              </Badge>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-card p-3 text-muted-foreground text-xs shadow-xs">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span>Analyzing pedagogical ontology & generating response...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
}
