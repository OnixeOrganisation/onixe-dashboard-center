"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Copy,
  Plus,
  Trash2,
  Variable,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { type CanvasBlock, DYNAMIC_VARIABLES, type KeyValueItem } from "../types";

interface BlockInspectorProps {
  block: CanvasBlock | null;
  onUpdateBlock: (updated: CanvasBlock) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (block: CanvasBlock) => void;
  onMoveBlock: (id: string, direction: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
}

export function BlockInspector({
  block,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  isFirst,
  isLast,
}: BlockInspectorProps) {
  if (!block) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-2 p-6 text-center text-muted-foreground">
        <Wand2 className="size-8 text-primary opacity-40" />
        <div className="font-semibold text-foreground text-xs">No Block Selected</div>
        <p className="max-w-[220px] text-[11px]">
          Click any element on the document canvas to customize its typography, borders, and dynamic tokens.
        </p>
      </div>
    );
  }

  const handleInsertToken = (token: string) => {
    if (block.content !== undefined) {
      onUpdateBlock({ ...block, content: `${block.content} ${token}` });
    }
  };

  const handleAddKeyValue = () => {
    const nextKeyValues = [
      ...(block.keyValues ?? []),
      { id: `kv-${Date.now()}-${Math.random()}`, label: "New Field", value: "{{student.name}}" },
    ];
    onUpdateBlock({ ...block, keyValues: nextKeyValues });
  };

  const handleUpdateKeyValue = (index: number, updatedItem: Partial<KeyValueItem>) => {
    const nextKeyValues = (block.keyValues ?? []).map((kv, idx) => (idx === index ? { ...kv, ...updatedItem } : kv));
    onUpdateBlock({ ...block, keyValues: nextKeyValues });
  };

  const handleDeleteKeyValue = (index: number) => {
    const nextKeyValues = (block.keyValues ?? []).filter((_, idx) => idx !== index);
    onUpdateBlock({ ...block, keyValues: nextKeyValues });
  };

  return (
    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
      {/* Block Header & Action Toolbar */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="font-mono text-[10px] uppercase">
            {block.type}
          </Badge>
          <span className="font-semibold text-foreground text-xs">Block Properties</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={isFirst}
            onClick={() => onMoveBlock(block.id, "up")}
            title="Move Up"
          >
            <ArrowUp className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={isLast}
            onClick={() => onMoveBlock(block.id, "down")}
            title="Move Down"
          >
            <ArrowDown className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => onDuplicateBlock(block)}
            title="Duplicate Block"
          >
            <Copy className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:text-destructive"
            onClick={() => onDeleteBlock(block.id)}
            title="Delete Block"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Title Field (if applicable) */}
      {(block.type === "grades-table" ||
        block.type === "invoice-table" ||
        block.type === "attendance-table" ||
        block.type === "callout") && (
        <div className="space-y-1">
          <Label className="text-xs">Section Heading Title</Label>
          <Input
            className="h-8 font-medium text-xs"
            value={block.title ?? ""}
            onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
            placeholder="e.g. Examination Results"
          />
        </div>
      )}

      {/* Content Field (Heading, Paragraph, Callout, Header) */}
      {(block.type === "heading" ||
        block.type === "paragraph" ||
        block.type === "callout" ||
        block.type === "header") && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Text & Variable Template</Label>
            <Select onValueChange={handleInsertToken}>
              <SelectTrigger className="h-6 w-32 text-[10px]">
                <Variable className="mr-1 size-3 text-primary" />
                <SelectValue placeholder="Add Token" />
              </SelectTrigger>
              <SelectContent>
                {DYNAMIC_VARIABLES.slice(0, 15).map((v) => (
                  <SelectItem key={v.key} value={v.key} className="text-xs">
                    {v.label} ({v.key})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            className="min-h-[90px] font-mono text-xs"
            value={block.content ?? ""}
            onChange={(e) => onUpdateBlock({ ...block, content: e.target.value })}
            placeholder="Type content or insert {{student.name}} variables..."
          />
        </div>
      )}

      {/* Heading Level (if heading) */}
      {block.type === "heading" && (
        <div className="space-y-1">
          <Label className="text-xs">Heading Scale</Label>
          <Select
            value={String(block.level ?? 2)}
            onValueChange={(v) => onUpdateBlock({ ...block, level: Number(v) as 1 | 2 | 3 })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1 — Document Main Title (Large)</SelectItem>
              <SelectItem value="2">H2 — Section Heading (Medium)</SelectItem>
              <SelectItem value="3">H3 — Sub-Section Heading (Small)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Text Alignment */}
      {(block.type === "heading" || block.type === "paragraph" || block.type === "callout") && (
        <div className="space-y-1">
          <Label className="text-xs">Text Alignment</Label>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={block.textAlign === "left" || !block.textAlign ? "default" : "outline"}
              size="sm"
              className="h-7 flex-1 gap-1 text-xs"
              onClick={() => onUpdateBlock({ ...block, textAlign: "left" })}
            >
              <AlignLeft className="size-3" />
              Left
            </Button>
            <Button
              type="button"
              variant={block.textAlign === "center" ? "default" : "outline"}
              size="sm"
              className="h-7 flex-1 gap-1 text-xs"
              onClick={() => onUpdateBlock({ ...block, textAlign: "center" })}
            >
              <AlignCenter className="size-3" />
              Center
            </Button>
            <Button
              type="button"
              variant={block.textAlign === "right" ? "default" : "outline"}
              size="sm"
              className="h-7 flex-1 gap-1 text-xs"
              onClick={() => onUpdateBlock({ ...block, textAlign: "right" })}
            >
              <AlignRight className="size-3" />
              Right
            </Button>
          </div>
        </div>
      )}

      {/* Key-Values Grid Editor */}
      {(block.type === "key-values" || block.type === "columns") && (
        <div className="space-y-2 border-t pt-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-xs">Grid Key-Values Items</Label>
            <Button size="sm" variant="outline" className="h-6 gap-1 text-[10px]" onClick={handleAddKeyValue}>
              <Plus className="size-3" />
              Add Row
            </Button>
          </div>

          <div className="max-h-[220px] space-y-1.5 overflow-y-auto pr-1">
            {(block.keyValues ?? []).map((kv, idx) => (
              <div
                key={kv.id ?? `${kv.label}-${kv.value}`}
                className="flex items-center gap-1.5 rounded border bg-muted/30 p-1.5"
              >
                <Input
                  className="h-7 w-1/3 font-medium text-[11px]"
                  value={kv.label}
                  placeholder="Label"
                  onChange={(e) => handleUpdateKeyValue(idx, { label: e.target.value })}
                />
                <Input
                  className="h-7 flex-1 font-mono text-[11px]"
                  value={kv.value}
                  placeholder="e.g. {{student.name}}"
                  onChange={(e) => handleUpdateKeyValue(idx, { value: e.target.value })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteKeyValue(idx)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signature & Seal Features */}
      {block.type === "signature-seal" && (
        <div className="space-y-2 border-t pt-2">
          <div className="flex items-center justify-between rounded border bg-card p-2 text-xs">
            <span>Official Center Seal / Stamp</span>
            <Switch
              checked={block.hasStamp ?? true}
              onCheckedChange={(checked) => onUpdateBlock({ ...block, hasStamp: checked })}
            />
          </div>
          <div className="flex items-center justify-between rounded border bg-card p-2 text-xs">
            <span>Blockchain QR Verification</span>
            <Switch
              checked={block.hasQrCode ?? true}
              onCheckedChange={(checked) => onUpdateBlock({ ...block, hasQrCode: checked })}
            />
          </div>
          <div className="flex items-center justify-between rounded border bg-card p-2 text-xs">
            <span>Dean Signature Box</span>
            <Switch
              checked={block.hasSignatureBox ?? true}
              onCheckedChange={(checked) => onUpdateBlock({ ...block, hasSignatureBox: checked })}
            />
          </div>
        </div>
      )}

      {/* Callout Card Colors */}
      {block.type === "callout" && (
        <div className="space-y-2 border-t pt-2 text-xs">
          <Label>Card Accent Style</Label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              className="rounded border border-emerald-300 bg-emerald-50 p-1.5 font-semibold text-[10px] text-emerald-800"
              onClick={() => onUpdateBlock({ ...block, backgroundColor: "#f0fdf4", borderColor: "#86efac" })}
            >
              Emerald Jury
            </button>
            <button
              type="button"
              className="rounded border border-blue-300 bg-blue-50 p-1.5 font-semibold text-[10px] text-blue-800"
              onClick={() => onUpdateBlock({ ...block, backgroundColor: "#eff6ff", borderColor: "#93c5fd" })}
            >
              Navy Legal
            </button>
            <button
              type="button"
              className="rounded border border-amber-300 bg-amber-50 p-1.5 font-semibold text-[10px] text-amber-800"
              onClick={() => onUpdateBlock({ ...block, backgroundColor: "#fffbeb", borderColor: "#fde68a" })}
            >
              Amber Notice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
