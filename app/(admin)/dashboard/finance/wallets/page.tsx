"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Wallet,
  CreditCard,
  Smartphone,
  Landmark,
  PiggyBank,
  Banknote,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import WalletModal from "./components/WalletModal";

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
  _count?: {
    transactions: number;
  };
}

const WALLET_ICONS: Record<string, React.ElementType> = {
  wallet: Wallet,
  "credit-card": CreditCard,
  smartphone: Smartphone,
  landmark: Landmark,
  "piggy-bank": PiggyBank,
  banknote: Banknote,
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletData | null>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await fetch("/api/finance/wallets");
      if (res.ok) setWallets(await res.json());
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Are you sure? All transactions in this wallet will be deleted.")
    )
      return;
    try {
      const res = await fetch(`/api/finance/wallets/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setWallets(wallets.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/finance/wallets/${id}/default`, {
        method: "POST",
      });
      if (res.ok) fetchWallets();
    } catch (error) {
      console.error("Failed to set default:", error);
    }
  };

  const formatCurrency = (amount: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const getWalletIcon = (iconName: string) => {
    const IconComponent = WALLET_ICONS[iconName] || Wallet;
    return IconComponent;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Wallets</h1>
          <p className="text-muted-foreground">
            Manage your accounts and wallets
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingWallet(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Wallet
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-3xl font-bold">
                {formatCurrency(totalBalance)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Across {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))
        ) : wallets.length > 0 ? (
          wallets.map((wallet) => {
            const IconComponent = getWalletIcon(wallet.icon);
            return (
              <Card
                key={wallet.id}
                className={cn(
                  "relative overflow-hidden transition-all hover:shadow-lg",
                  !wallet.isActive && "opacity-60"
                )}
              >
                {/* Color accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: wallet.color }}
                />

                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${wallet.color}20` }}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style={{ color: wallet.color }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {wallet.name}
                        {wallet.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground capitalize">
                        {wallet.type.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!wallet.isDefault && (
                        <DropdownMenuItem
                          onClick={() => handleSetDefault(wallet.id)}
                        >
                          Set as Default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingWallet(wallet);
                          setModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(wallet.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold mb-4">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>
                        {wallet._count?.transactions || 0} transactions
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                      >
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        In
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                      >
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="mb-4">No wallets yet</p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Wallet Card */}
        {wallets.length > 0 && (
          <Card
            className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => {
              setEditingWallet(null);
              setModalOpen(true);
            }}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[180px]">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">Add New Wallet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Wallet Modal */}
      <WalletModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        wallet={editingWallet}
        onSuccess={() => {
          setModalOpen(false);
          fetchWallets();
        }}
      />
    </div>
  );
}
