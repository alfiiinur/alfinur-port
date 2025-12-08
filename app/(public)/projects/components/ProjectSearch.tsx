"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProjectSearch({ value, onChange }: ProjectSearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search projects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-11 rounded-full bg-secondary border-0 focus-visible:ring-2"
      />
    </div>
  );
}
