"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, RotateCcw, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./components/ImageUploader";
import { ScanResult } from "./components/ScanResult";
import {
  TransactionForm,
  TransactionFormData,
} from "./components/TransactionForm";
import { ParsedReceipt } from "@/lib/ocr/types";

interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export default function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ParsedReceipt | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallets
  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await fetch("/api/finance/wallets");
      if (res.ok) {
        const data = await res.json();
        setWallets(data);
      }
    } catch (err) {
      console.error("Failed to fetch wallets:", err);
    }
  };

  const handleImageSelect = useCallback(async (file: File) => {
    setError(null);
    setSaveSuccess(false);
    setScanResult(null);

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);

    // Process OCR
    setIsProcessing(true);
    try {
      // Dynamic import untuk menghindari SSR issues dengan Tesseract
      const { scanReceipt } = await import("@/lib/ocr");
      const result = await scanReceipt(file, "tesseract");
      setScanResult(result);
    } catch (err) {
      console.error("OCR Error:", err);
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setSelectedImage(null);
    setSelectedFile(null);
    setScanResult(null);
    setError(null);
    setSaveSuccess(false);
  }, []);

  const handleSaveTransaction = async (data: TransactionFormData) => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: new Date(data.date),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save transaction");
      }

      setSaveSuccess(true);

      // Reset after 2 seconds
      setTimeout(() => {
        handleClear();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (saveSuccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">OCR Bill Scanner</h1>
          <p className="text-muted-foreground">
            Scan receipts and bills to automatically add transactions
          </p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Transaction Saved!</h2>
            <p className="text-muted-foreground mb-6">
              Your transaction has been added successfully.
            </p>
            <Button onClick={handleClear} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Scan Another Receipt
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">OCR Bill Scanner</h1>
        <p className="text-muted-foreground">
          Scan receipts and bills to automatically add transactions
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Upload & Preview */}
        <div className="space-y-6">
          <ImageUploader
            onImageSelect={handleImageSelect}
            isProcessing={isProcessing}
            selectedImage={selectedImage}
            onClear={handleClear}
          />

          {/* Scan Result */}
          {scanResult && <ScanResult result={scanResult} />}
        </div>

        {/* Right: Transaction Form */}
        <div>
          <TransactionForm
            scanResult={scanResult}
            wallets={wallets}
            onSave={handleSaveTransaction}
            isSaving={isSaving}
          />

          {/* Tips */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Tips for Better Results
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use good lighting when taking photos</li>
                <li>• Make sure the receipt is flat and not crumpled</li>
                <li>• Capture the entire receipt in frame</li>
                <li>• Avoid shadows and reflections</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
