"use client";

import { ParsedReceipt } from "@/lib/ocr/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  Calendar,
  Store,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";

interface ScanResultProps {
  result: ParsedReceipt | null;
}

export function ScanResult({ result }: ScanResultProps) {
  if (!result) return null;

  const confidenceColor =
    result.confidence >= 80
      ? "bg-green-500"
      : result.confidence >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Scan Result
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <span className={`w-2 h-2 rounded-full ${confidenceColor}`} />
            {Math.round(result.confidence)}% confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount */}
        <div className="p-4 rounded-lg bg-primary/10 text-center">
          <p className="text-sm text-muted-foreground mb-1">Detected Amount</p>
          <p className="text-3xl font-bold text-primary">
            {result.amount
              ? `Rp ${result.amount.toLocaleString("id-ID")}`
              : "Not detected"}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Store className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Merchant</p>
              <p className="font-medium truncate">
                {result.merchant || "Not detected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{result.date || "Not detected"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Suggested Category
              </p>
              <p className="font-medium">{result.category || "Other"}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        {result.items.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Detected Items</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {result.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm p-2 rounded bg-muted/30"
                >
                  <span className="truncate">{item.name}</span>
                  {item.price && (
                    <span className="text-muted-foreground">
                      Rp {item.price.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Text Preview */}
        <details className="group">
          <summary className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            <FileText className="h-4 w-4" />
            View raw OCR text
          </summary>
          <pre className="mt-2 p-3 rounded-lg bg-muted text-xs overflow-auto max-h-40 whitespace-pre-wrap">
            {result.rawText || "No text detected"}
          </pre>
        </details>

        {result.confidence < 60 && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-sm">
              Low confidence scan. Please verify the extracted data before
              saving.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
