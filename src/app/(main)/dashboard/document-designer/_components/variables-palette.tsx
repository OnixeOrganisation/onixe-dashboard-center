"use client";

import * as React from "react";

import { Check, Copy, Plus, Search, Variable } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DYNAMIC_VARIABLES, type DynamicVariable } from "../types";

interface VariablesPaletteProps {
  onInsertVariable: (varKey: string) => void;
}

export function VariablesPalette({ onInsertVariable }: VariablesPaletteProps) {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const categories = ["All", "Student", "Institution", "Academic", "Financial", "Security"];

  const filteredVars = DYNAMIC_VARIABLES.filter((v) => {
    const matchesSearch =
      v.key.toLowerCase().includes(search.toLowerCase()) ||
      v.label.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || v.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (variable: DynamicVariable) => {
    navigator.clipboard.writeText(variable.key);
    setCopiedKey(variable.key);
    setTimeout(() => setCopiedKey(null), 1500);
    toast.success(`Copied ${variable.key}`, {
      description: `Example value: "${variable.exampleValue}"`,
    });
  };

  return (
    <div className="flex h-full flex-col space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold text-xs">
            <Variable className="size-3.5 text-primary" />
            Dynamic System Variables
          </span>
          <Badge variant="outline" className="text-[10px]">
            {filteredVars.length} Available
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Click any variable below to insert it into the active block or copy it to clipboard. The system automatically
          populates these with real learner/center data at generation time.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search variables (e.g. name, siret, ects)..."
          className="h-8 pl-8 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded px-2 py-0.5 font-medium text-[10px] transition-colors ${
              selectedCategory === cat
                ? "bg-primary font-semibold text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Variables List */}
      <div className="max-h-[440px] flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredVars.map((v) => (
          <div
            key={v.key}
            className="flex flex-col gap-1 rounded-lg border bg-card/60 p-2 text-xs transition-all hover:border-primary/40 hover:bg-muted/40"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[11px] text-foreground">{v.label}</span>
              <Badge variant="secondary" className="px-1.5 py-0 font-mono text-[9px]">
                {v.category}
              </Badge>
            </div>

            <div className="mt-0.5 flex items-center justify-between gap-2">
              <code className="max-w-[200px] select-all truncate rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-primary">
                {v.key}
              </code>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" className="size-6" onClick={() => handleCopy(v)} title="Copy Token">
                  {copiedKey === v.key ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 gap-1 px-2 text-[10px]"
                  onClick={() => {
                    onInsertVariable(v.key);
                    toast.success(`Inserted ${v.key}`);
                  }}
                >
                  <Plus className="size-3" />
                  Insert
                </Button>
              </div>
            </div>

            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>Preview:</span>
              <span className="truncate font-medium text-foreground italic">{v.exampleValue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
