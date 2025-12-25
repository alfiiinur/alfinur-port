"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[400px] border rounded-md bg-muted animate-pulse" />
    );
  }

  return (
    <div data-color-mode="auto" className="w-full">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview="live"
        height={400}
        textareaProps={{ placeholder }}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Supports Markdown. Use ```language for code blocks (e.g. ```javascript)
      </p>
    </div>
  );
}
