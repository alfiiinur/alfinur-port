"use client";

import { useState, useEffect } from "react";
import { ParsedReceipt } from "@/lib/ocr/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";

interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface TransactionFormProps {
  scanResult: ParsedReceipt | null;
  wallets: Wallet[];
  onSave: (data: TransactionFormData) => Promise<void>;
  isSaving: boolean;
}

export interface TransactionFormData {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  date: string;
  walletId: string;
}

const CATEGORIES = [
  "Food & Beverage",
  "Transportation",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Other",
];

export function TransactionForm({
  scanResult,
  wallets,
  onSave,
  isSaving,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    type: "EXPENSE",
    category: "Other",
    description: "",
    date: new Date().toISOString().split("T")[0],
    walletId: "",
  });

  // Update form when scan result changes
  useEffect(() => {
    if (scanResult) {
      setFormData((prev) => ({
        ...prev,
        amount: scanResult.amount || 0,
        category: scanResult.category || "Other",
        description: scanResult.merchant || "",
      }));
    }
  }, [scanResult]);

  // Set default wallet
  useEffect(() => {
    if (wallets.length > 0 && !formData.walletId) {
      const defaultWallet =
        wallets.find((w) => w.type === "CASH") || wallets[0];
      setFormData((prev) => ({ ...prev, walletId: defaultWallet.id }));
    }
  }, [wallets, formData.walletId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return;
    await onSave(formData);
  };

  const handleChange = (
    field: keyof TransactionFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!scanResult) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Upload and scan a receipt to create a transaction</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Create Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Rp)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                handleChange("amount", parseInt(e.target.value) || 0)
              }
              placeholder="0"
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === "EXPENSE" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleChange("type", "EXPENSE")}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={formData.type === "INCOME" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleChange("type", "INCOME")}
              >
                Income
              </Button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => handleChange("category", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Lunch at restaurant"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          {/* Wallet */}
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet</Label>
            <Select
              value={formData.walletId}
              onValueChange={(v) => handleChange("walletId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name} (Rp {wallet.balance.toLocaleString("id-ID")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isSaving || formData.amount <= 0 || !formData.walletId}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Transaction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
