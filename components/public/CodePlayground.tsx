"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
} from "lucide-react";

interface CodePlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  title?: string;
}

type TabType = "html" | "css" | "js";

// Simple syntax highlighting
function highlightHtml(code: string): string {
  return (
    code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Tags
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="text-pink-400">$2</span>')
      // Attributes
      .replace(/\s([\w-]+)=/g, ' <span class="text-yellow-300">$1</span>=')
      // Attribute values
      .replace(/="([^"]*)"/g, '="<span class="text-green-400">$1</span>"')
      // Comments
      .replace(
        /(&lt;!--[\s\S]*?--&gt;)/g,
        '<span class="text-gray-500">$1</span>'
      )
  );
}

function highlightCss(code: string): string {
  return (
    code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Selectors
      .replace(
        /^([.#]?[\w-]+)(\s*\{)/gm,
        '<span class="text-yellow-300">$1</span>$2'
      )
      // Properties
      .replace(/([\w-]+)(\s*:)/g, '<span class="text-cyan-400">$1</span>$2')
      // Values with units
      .replace(/:\s*([^;{]+)/g, ': <span class="text-green-400">$1</span>')
      // Comments
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
  );
}

function highlightJs(code: string): string {
  return (
    code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Keywords
      .replace(
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this|true|false|null|undefined)\b/g,
        '<span class="text-purple-400">$1</span>'
      )
      // Strings
      .replace(
        /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g,
        '<span class="text-green-400">$&</span>'
      )
      // Numbers
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>')
      // Functions
      .replace(/\b([\w]+)(\s*\()/g, '<span class="text-yellow-300">$1</span>$2')
      // Comments
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
  );
}

export default function CodePlayground({
  initialHtml = "",
  initialCss = "",
  initialJs = "",
  title = "Code Playground",
}: CodePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  const tabs: { id: TabType; label: string; color: string }[] = [
    { id: "html", label: "HTML", color: "text-orange-500" },
    { id: "css", label: "CSS", color: "text-blue-500" },
    { id: "js", label: "JS", color: "text-yellow-500" },
  ];

  const getCurrentCode = () => {
    switch (activeTab) {
      case "html":
        return html;
      case "css":
        return css;
      case "js":
        return js;
    }
  };

  const setCurrentCode = (value: string) => {
    switch (activeTab) {
      case "html":
        setHtml(value);
        break;
      case "css":
        setCss(value);
        break;
      case "js":
        setJs(value);
        break;
    }
  };

  const highlightedCode = useMemo(() => {
    const code = getCurrentCode();
    switch (activeTab) {
      case "html":
        return highlightHtml(code);
      case "css":
        return highlightCss(code);
      case "js":
        return highlightJs(code);
    }
  }, [activeTab, html, css, js]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const generatePreview = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; padding: 16px; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>${js}</script>
</body>
</html>`;
  };

  const updatePreview = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generatePreview());
        doc.close();
      }
    }
  };

  useEffect(() => {
    updatePreview();
  }, [html, css, js]);

  const handleReset = () => {
    setHtml(initialHtml);
    setCss(initialCss);
    setJs(initialJs);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-border overflow-hidden bg-[#1e1e1e]",
        isFullscreen && "fixed inset-4 z-50 my-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-border">
        <span className="text-sm font-medium text-white/80">{title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col lg:flex-row",
          isFullscreen ? "h-[calc(100%-44px)]" : "h-[400px]"
        )}
      >
        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-2 py-1 bg-[#2d2d2d] border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded transition-colors",
                  activeTab === tab.id
                    ? "bg-[#1e1e1e] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span className={activeTab === tab.id ? tab.color : ""}>
                  {tab.label}
                </span>
              </button>
            ))}
            <div className="ml-auto">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 relative overflow-hidden">
            {/* Syntax highlighted layer */}
            <pre
              ref={highlightRef}
              className="absolute inset-0 p-4 font-mono text-sm overflow-auto pointer-events-none whitespace-pre-wrap"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: highlightedCode + "\n" }}
            />
            {/* Editable textarea */}
            <textarea
              ref={textareaRef}
              value={getCurrentCode()}
              onChange={(e) => setCurrentCode(e.target.value)}
              onScroll={handleScroll}
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
              placeholder={`Enter ${activeTab.toUpperCase()} code here...`}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-border">
            <span className="text-xs font-medium text-white/60">Preview</span>
            <button
              onClick={updatePreview}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              <Play className="w-3 h-3" /> Run
            </button>
          </div>
          <iframe
            ref={iframeRef}
            className="flex-1 w-full bg-white"
            sandbox="allow-scripts"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
