"use client";

import * as React from "react";
import { Camera, Image as ImageIcon, Link as LinkIcon, Trash2, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserAvatarPickerProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  label?: string;
  description?: string;
  className?: string;
}

export function UserAvatarPicker({
  value,
  onChange,
  name = "User",
  label = "Photo de profil / Avatar",
  description = "Importer une photo (PNG, JPG, WebP) ou saisir une URL.",
  className = "",
}: UserAvatarPickerProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlValue, setUrlValue] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);

  const initials = React.useMemo(() => {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
  }, [name]);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    try {
      const dataUrl = await resizeImage(file, 400);
      onChange(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          onChange(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlValue.trim()) {
      onChange(urlValue.trim());
      setShowUrlInput(false);
      setUrlValue("");
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="font-medium text-xs text-foreground">{label}</Label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="size-3" />
          {showUrlInput ? "Parcourir fichier" : "Saisir URL"}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Clickable / Draggable Avatar Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-all ${
            isDragging
              ? "border-primary bg-primary/10 scale-105"
              : value
              ? "border-primary/40 hover:border-primary"
              : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/40"
          }`}
          title="Cliquer pour choisir une image"
        >
          <Avatar className="size-full">
            {value && <AvatarImage src={value} alt={name} className="object-cover" />}
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
            <Camera className="size-4 text-white" />
          </div>
        </div>

        {/* Action Controls & Info */}
        <div className="flex flex-1 flex-col gap-1.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              Choisir une photo
            </Button>

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleClear}
              >
                <Trash2 className="size-3.5" />
                Supprimer
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">{description}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {showUrlInput && (
        <div className="mt-2 flex items-center gap-2">
          <Input
            placeholder="https://example.com/avatar.jpg"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            className="h-8 text-xs"
          />
          <Button type="button" size="sm" variant="secondary" className="h-8 px-3 text-xs" onClick={handleApplyUrl}>
            Appliquer
          </Button>
        </div>
      )}
    </div>
  );
}

function resizeImage(file: File, maxSize: number = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
