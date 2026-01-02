"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

const CodePlayground = dynamic(() => import("./CodePlayground"), {
  ssr: false,
});

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Copy button component for code blocks
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-md bg-[#30363d] hover:bg-[#484f58] text-gray-400 hover:text-white transition-all z-10"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      )}
    </button>
  );
}

// Parse playground blocks from content
function parsePlaygrounds(content: string) {
  const playgroundRegex =
    /```playground(?:\s+title="([^"]*)")?\n([\s\S]*?)```/g;
  const parts: Array<{
    type: "text" | "playground";
    content: string;
    title?: string;
    html?: string;
    css?: string;
    js?: string;
  }> = [];
  let lastIndex = 0;
  let match;

  while ((match = playgroundRegex.exec(content)) !== null) {
    // Add text before playground
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }

    // Parse playground content
    const title = match[1] || "Code Playground";
    const playgroundContent = match[2];

    // Extract HTML, CSS, JS sections
    const htmlMatch = playgroundContent.match(
      /---html---\n([\s\S]*?)(?=---css---|---js---|$)/
    );
    const cssMatch = playgroundContent.match(
      /---css---\n([\s\S]*?)(?=---html---|---js---|$)/
    );
    const jsMatch = playgroundContent.match(
      /---js---\n([\s\S]*?)(?=---html---|---css---|$)/
    );

    parts.push({
      type: "playground",
      content: "",
      title,
      html: htmlMatch?.[1]?.trim() || "",
      css: cssMatch?.[1]?.trim() || "",
      js: jsMatch?.[1]?.trim() || "",
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text" as const, content }];
}

export default function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  const parts = parsePlaygrounds(content);

  return (
    <div className={`markdown-content ${className}`}>
      {parts.map((part, index) => {
        if (part.type === "playground") {
          return (
            <CodePlayground
              key={index}
              title={part.title}
              initialHtml={part.html}
              initialCss={part.css}
              initialJs={part.js}
            />
          );
        }

        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Code blocks with copy button
              pre: ({ children }) => {
                // Extract code text from children
                const getCodeText = (node: React.ReactNode): string => {
                  if (typeof node === "string") return node;
                  if (Array.isArray(node))
                    return node.map(getCodeText).join("");
                  if (node && typeof node === "object" && "props" in node) {
                    const props = node.props as { children?: React.ReactNode };
                    return getCodeText(props.children);
                  }
                  return "";
                };
                const codeText = getCodeText(children);

                return (
                  <pre className="relative rounded-lg overflow-hidden my-4 bg-[#0d1117] group">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                      <span className="flex-1" />
                      <CopyButton code={codeText} />
                    </div>
                    <div className="p-4 overflow-x-auto">{children}</div>
                  </pre>
                );
              },
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code
                      className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={`${className} text-sm`} {...props}>
                    {children}
                  </code>
                );
              },
              // Headings
              h1: ({ children }) => {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                return (
                  <h1
                    id={id}
                    className="text-3xl font-bold mt-8 mb-4 scroll-mt-24"
                  >
                    {children}
                  </h1>
                );
              },
              h2: ({ children }) => {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                return (
                  <h2
                    id={id}
                    className="text-2xl font-bold mt-6 mb-3 scroll-mt-24"
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                return (
                  <h3
                    id={id}
                    className="text-xl font-semibold mt-5 mb-2 scroll-mt-24"
                  >
                    {children}
                  </h3>
                );
              },
              // Paragraphs
              p: ({ children }) => (
                <p className="leading-relaxed mb-4 text-foreground/90">
                  {children}
                </p>
              ),
              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground/90">{children}</li>
              ),
              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {children}
                </a>
              ),
              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                  {children}
                </blockquote>
              ),
              // Table
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border border-border rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 bg-muted font-semibold text-left border-b">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 border-b border-border">{children}</td>
              ),
              // Horizontal rule
              hr: () => <hr className="my-8 border-border" />,
              // Images
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ""}
                  className="rounded-lg my-4 max-w-full"
                />
              ),
            }}
          >
            {part.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
