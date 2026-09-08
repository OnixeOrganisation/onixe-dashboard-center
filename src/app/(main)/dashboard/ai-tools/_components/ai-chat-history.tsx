"use client";

import * as React from "react";

import { cn } from "cn";
import { BookOpen, FileCheck, MessageSquare, Plus, Search, Sparkles, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ChatSession } from "../types";

interface AiChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  syllabus: <BookOpen className="size-3.5 text-purple-500" />,
  retention: <Users className="size-3.5 text-amber-500" />,
  qualiopi: <FileCheck className="size-3.5 text-emerald-500" />,
  scheduling: <Sparkles className="size-3.5 text-sky-500" />,
  general: <MessageSquare className="size-3.5 text-muted-foreground" />,
};

export function AiChatHistory({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: AiChatHistoryProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col border-r bg-muted/20">
      {/* Header & New Chat button */}
      <div className="space-y-3 p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="font-semibold text-xs leading-none">Pedagogical AI</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Conversational Workspace</div>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] text-primary">
            v2.4
          </Badge>
        </div>

        <Button onClick={onNewChat} size="sm" className="w-full justify-start gap-2 text-xs">
          <Plus className="size-4" />
          New Pedagogical Chat
        </Button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* History List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {filteredSessions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">No conversations found</div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const icon = CATEGORY_ICONS[session.category] || CATEGORY_ICONS.general;

              return (
                <div
                  key={session.id}
                  className={cn(
                    "group relative flex w-full flex-col gap-1 rounded-lg border border-transparent p-2.5 text-left transition-all hover:bg-accent/60",
                    isActive && "border-border bg-card shadow-xs",
                  )}
                >
                  <div className="flex w-full items-start justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectSession(session.id)}
                      className="flex flex-1 items-center gap-1.5 text-left font-medium text-xs"
                    >
                      {icon}
                      <span className="line-clamp-1 text-foreground">{session.title}</span>
                    </button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="h-5 w-5 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      title="Delete conversation"
                    >
                      <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>

                  <button type="button" onClick={() => onSelectSession(session.id)} className="text-left">
                    <p className="line-clamp-1 text-[11px] text-muted-foreground">{session.lastMessageSnippet}</p>
                  </button>

                  <div className="flex w-full items-center justify-between pt-0.5 text-[10px] text-muted-foreground/70">
                    <span className="capitalize">{session.category}</span>
                    <span>{session.updatedAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
