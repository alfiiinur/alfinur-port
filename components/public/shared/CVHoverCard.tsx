"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Download, Eye, FileDown, FileText } from "lucide-react";

interface CVHoverCardProps {
  cvUrl?: string;
  className?: string;
}

export const CVHoverCard = ({
  cvUrl = "/cv/cv-alfi.pdf",
  className = "",
}: CVHoverCardProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = "CV-Alfi-Nur-Danialin.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open(cvUrl, "_blank");
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          className={`flex items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 cursor-pointer hover:opacity-80 transition ${className}`}
        >
          <FileDown size={16} className="text-white dark:text-black" />
          <span className="text-sm font-bold text-white dark:text-black">
            CV Alfi Nur
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-72 p-0 overflow-hidden"
        side="bottom"
        align="end"
      >
        {/* PDF Preview */}
        <div className="relative bg-gray-100 dark:bg-gray-800 h-40 flex items-center justify-center">
          <iframe
            src={`${cvUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full border-0"
            title="CV Preview"
          />
          {/* Fallback jika PDF tidak load */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 pointer-events-none opacity-0 hover:opacity-0">
            <FileText size={48} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">CV Preview</span>
          </div>
        </div>

        {/* Info & Actions */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Curriculum Vitae
            </h4>
            <p className="text-xs text-muted-foreground">
              Alfi Nur Danialin - IT Developer
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleView}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Eye size={14} />
              View
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-colors"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
