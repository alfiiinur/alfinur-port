"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types/finance";

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category: string;
  description?: string;
  date: string;
  walletId: string;
  walletName: string;
  tags: string[];
}

interface Wallet {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  wallets: Wallet[];
  onSuccess: () => void;
}

export default function TransactionModal({
  open,
  onOpenChange,
  transaction,
  wallets,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    walletId: "",
  });

  useEffect(() => {
    if (transaction) {
      setType(transaction.type as "INCOME" | "EXPENSE");
      setFormData({
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description || "",
        date: transaction.date.split("T")[0],
        walletId: transaction.walletId,
      });
    } else {
      setType("EXPENSE");
      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        walletId: wallets[0]?.id || "",
      });
    }
  }, [transaction, wallets, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = transaction
        ? `/api/finance/transactions/${transaction.id}`
        : "/api/finance/transactions";
      const method = transaction ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type,
          amount: parseFloat(formData.amount),
        }),
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        {wallets.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You need to create a wallet first before adding transactions.
            </p>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                window.location.href = "/dashboard/finance/wallets";
              }}
            >
              Create Wallet
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={cn(
                  "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
                  type === "EXPENSE"
                    ? "bg-red-500 text-white"
                    : "hover:bg-muted-foreground/10"
                )}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={cn(
                  "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
                  type === "INCOME"
                    ? "bg-green-500 text-white"
                    : "hover:bg-muted-foreground/10"
                )}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                className="text-2xl font-bold h-14"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Wallet */}
            <div className="space-y-2">
              <Label>Wallet</Label>
              <Select
                value={formData.walletId}
                onValueChange={(value) =>
                  setFormData({ ...formData, walletId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a note..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || !formData.walletId}
              >
                {loading ? "Saving..." : transaction ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
