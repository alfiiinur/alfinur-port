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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Wallet,
  CreditCard,
  Smartphone,
  Landmark,
  PiggyBank,
  Banknote,
} from "lucide-react";

interface WalletData {
  id: string;
  name: string;
  type: "CASH" | "BANK" | "E_WALLET" | "CREDIT_CARD" | "INVESTMENT";
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isActive: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: WalletData | null;
  onSuccess: () => void;
}

const WALLET_TYPES = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank Account" },
  { value: "E_WALLET", label: "E-Wallet" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "INVESTMENT", label: "Investment" },
];

const WALLET_ICONS = [
  { value: "wallet", icon: Wallet, label: "Wallet" },
  { value: "credit-card", icon: CreditCard, label: "Card" },
  { value: "smartphone", icon: Smartphone, label: "Phone" },
  { value: "landmark", icon: Landmark, label: "Bank" },
  { value: "piggy-bank", icon: PiggyBank, label: "Savings" },
  { value: "banknote", icon: Banknote, label: "Cash" },
];

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#eab308",
];

export default function WalletModal({
  open,
  onOpenChange,
  wallet,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "CASH",
    balance: "",
    currency: "IDR",
    color: "#3b82f6",
    icon: "wallet",
  });

  useEffect(() => {
    if (wallet) {
      setFormData({
        name: wallet.name,
        type: wallet.type,
        balance: wallet.balance.toString(),
        currency: wallet.currency,
        color: wallet.color,
        icon: wallet.icon,
      });
    } else {
      setFormData({
        name: "",
        type: "CASH",
        balance: "0",
        currency: "IDR",
        color: "#3b82f6",
        icon: "wallet",
      });
    }
  }, [wallet, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = wallet
        ? `/api/finance/wallets/${wallet.id}`
        : "/api/finance/wallets";
      const method = wallet ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          balance: parseFloat(formData.balance),
        }),
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{wallet ? "Edit Wallet" : "Add Wallet"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              placeholder="e.g., Main Bank Account"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WALLET_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Balance */}
          <div className="space-y-2">
            <Label htmlFor="balance">
              {wallet ? "Current Balance" : "Initial Balance"}
            </Label>
            <Input
              id="balance"
              type="number"
              placeholder="0"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
              required
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {WALLET_ICONS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, icon: item.value })
                    }
                    className={cn(
                      "h-10 w-10 rounded-lg border flex items-center justify-center transition-colors",
                      formData.icon === item.value
                        ? "border-primary bg-primary/10"
                        : "hover:bg-muted"
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform",
                    formData.color === color &&
                      "ring-2 ring-offset-2 ring-primary scale-110"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-muted/50">
            <p className="text-xs text-muted-foreground mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {(() => {
                  const IconComponent =
                    WALLET_ICONS.find((i) => i.value === formData.icon)?.icon ||
                    Wallet;
                  return (
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: formData.color }}
                    />
                  );
                })()}
              </div>
              <div>
                <p className="font-medium">{formData.name || "Wallet Name"}</p>
                <p className="text-xs text-muted-foreground">
                  {WALLET_TYPES.find((t) => t.value === formData.type)?.label}
                </p>
              </div>
            </div>
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
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : wallet ? "Update" : "Create Wallet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
