"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Trash2,
  Edit,
  MoreHorizontal,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import TransactionModal from "./components/TransactionModal";

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

type DateFilterType = "all" | "today" | "week" | "month" | "year" | "custom";

export default function MoneyTrackPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [walletFilter, setWalletFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, walletRes] = await Promise.all([
        fetch("/api/finance/transactions"),
        fetch("/api/finance/wallets"),
      ]);
      if (txRes.ok) setTransactions(await txRes.json());
      if (walletRes.ok) setWallets(await walletRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await fetch(`/api/finance/transactions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTransactions(transactions.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Generate years for filter (last 5 years)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  // Generate months
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search filter
      const matchSearch =
        tx.category.toLowerCase().includes(search.toLowerCase()) ||
        tx.description?.toLowerCase().includes(search.toLowerCase());

      // Type filter
      const matchType = typeFilter === "all" || tx.type === typeFilter;

      // Wallet filter
      const matchWallet =
        walletFilter === "all" || tx.walletId === walletFilter;

      // Date filter
      let matchDate = true;
      const txDate = new Date(tx.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case "today":
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59, 999);
          matchDate = txDate >= today && txDate <= todayEnd;
          break;
        case "week":
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
          matchDate = txDate >= weekStart && txDate <= weekEnd;
          break;
        case "month":
          if (selectedMonth && selectedYear) {
            const monthStart = new Date(
              parseInt(selectedYear),
              parseInt(selectedMonth) - 1,
              1
            );
            const monthEnd = new Date(
              parseInt(selectedYear),
              parseInt(selectedMonth),
              0
            );
            monthEnd.setHours(23, 59, 59, 999);
            matchDate = txDate >= monthStart && txDate <= monthEnd;
          }
          break;
        case "year":
          if (selectedYear) {
            const yearStart = new Date(parseInt(selectedYear), 0, 1);
            const yearEnd = new Date(parseInt(selectedYear), 11, 31);
            yearEnd.setHours(23, 59, 59, 999);
            matchDate = txDate >= yearStart && txDate <= yearEnd;
          }
          break;
        case "custom":
          if (customStartDate) {
            const start = new Date(customStartDate);
            matchDate = txDate >= start;
          }
          if (customEndDate && matchDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            matchDate = txDate <= end;
          }
          break;
      }

      return matchSearch && matchType && matchWallet && matchDate;
    });
  }, [
    transactions,
    search,
    typeFilter,
    walletFilter,
    dateFilter,
    selectedMonth,
    selectedYear,
    customStartDate,
    customEndDate,
  ]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, tx) => {
        if (tx.type === "INCOME") acc.income += tx.amount;
        else if (tx.type === "EXPENSE") acc.expense += tx.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredTransactions]);

  // Get active filter label
  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case "today":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        if (selectedMonth && selectedYear) {
          const monthName = months.find(
            (m) => m.value === selectedMonth
          )?.label;
          return `${monthName} ${selectedYear}`;
        }
        return "Select Month";
      case "year":
        return selectedYear || "Select Year";
      case "custom":
        if (customStartDate && customEndDate) {
          return `${customStartDate} - ${customEndDate}`;
        } else if (customStartDate) {
          return `From ${customStartDate}`;
        }
        return "Custom Range";
      default:
        return "All Time";
    }
  };

  // Export functions
  const exportToExcel = async () => {
    setExporting(true);
    try {
      const data: Record<string, string | number>[] = filteredTransactions.map(
        (tx) => ({
          Date: new Date(tx.date).toLocaleDateString("id-ID"),
          Type: tx.type,
          Category: tx.category,
          Description: tx.description || "-",
          Wallet: tx.walletName,
          Amount: tx.amount,
        })
      );

      // Add summary row
      data.push({
        Date: "",
        Type: "",
        Category: "",
        Description: "TOTAL INCOME",
        Wallet: "",
        Amount: totals.income,
      });
      data.push({
        Date: "",
        Type: "",
        Category: "",
        Description: "TOTAL EXPENSE",
        Wallet: "",
        Amount: totals.expense,
      });
      data.push({
        Date: "",
        Type: "",
        Category: "",
        Description: "NET BALANCE",
        Wallet: "",
        Amount: totals.income - totals.expense,
      });

      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((h) => {
              const val = row[h as keyof typeof row];
              return typeof val === "string" && val.includes(",")
                ? `"${val}"`
                : val;
            })
            .join(",")
        ),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions_${getDateFilterLabel().replace(
        /\s/g,
        "_"
      )}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      // Create printable HTML
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Transaction Report - ${getDateFilterLabel()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; margin-bottom: 5px; }
            .subtitle { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .income { color: #16a34a; }
            .expense { color: #dc2626; }
            .summary { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
            .summary-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .amount-right { text-align: right; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h1>Transaction Report</h1>
          <p class="subtitle">Period: ${getDateFilterLabel()}</p>
          
          <div class="summary">
            <div class="summary-row">
              <span>Total Income:</span>
              <span class="income">${formatCurrency(totals.income)}</span>
            </div>
            <div class="summary-row">
              <span>Total Expense:</span>
              <span class="expense">${formatCurrency(totals.expense)}</span>
            </div>
            <div class="summary-row" style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 5px;">
              <strong>Net Balance:</strong>
              <strong style="color: ${
                totals.income - totals.expense >= 0 ? "#16a34a" : "#dc2626"
              }">
                ${formatCurrency(totals.income - totals.expense)}
              </strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Wallet</th>
                <th class="amount-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions
                .map(
                  (tx) => `
                <tr>
                  <td>${new Date(tx.date).toLocaleDateString("id-ID")}</td>
                  <td class="${tx.type === "INCOME" ? "income" : "expense"}">${
                    tx.type
                  }</td>
                  <td>${tx.category}</td>
                  <td>${tx.description || "-"}</td>
                  <td>${tx.walletName}</td>
                  <td class="amount-right ${
                    tx.type === "INCOME" ? "income" : "expense"
                  }">
                    ${tx.type === "INCOME" ? "+" : "-"}${formatCurrency(
                    tx.amount
                  )}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <p style="margin-top: 30px; color: #999; font-size: 12px;">
            Generated on ${new Date().toLocaleString("id-ID")}
          </p>
        </body>
        </html>
      `;

      // Open print dialog
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const clearDateFilter = () => {
    setDateFilter("all");
    setSelectedMonth("");
    setSelectedYear("");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Money Track</h1>
          <p className="text-muted-foreground">
            Track all your income and expenses
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTransaction(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totals.income)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expense</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totals.expense)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  totals.income - totals.expense >= 0
                    ? "bg-blue-500/10"
                    : "bg-orange-500/10"
                )}
              >
                <Calendar
                  className={cn(
                    "h-5 w-5",
                    totals.income - totals.expense >= 0
                      ? "text-blue-500"
                      : "text-orange-500"
                  )}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    totals.income - totals.expense >= 0
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-orange-600 dark:text-orange-400"
                  )}
                >
                  {formatCurrency(totals.income - totals.expense)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Row 1: Search and basic filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={walletFilter} onValueChange={setWalletFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wallets</SelectItem>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 2: Date filters and Export */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Date Filter Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto justify-start"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {getDateFilterLabel()}
                    {dateFilter !== "all" && (
                      <X
                        className="h-4 w-4 ml-2 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearDateFilter();
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Quick Filters</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "all", label: "All Time" },
                          { value: "today", label: "Today" },
                          { value: "week", label: "This Week" },
                        ].map((opt) => (
                          <Button
                            key={opt.value}
                            variant={
                              dateFilter === opt.value ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setDateFilter(opt.value as DateFilterType)
                            }
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>By Month</Label>
                      <div className="flex gap-2">
                        <Select
                          value={selectedMonth}
                          onValueChange={(v) => {
                            setSelectedMonth(v);
                            setDateFilter("month");
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((m) => (
                              <SelectItem key={m.value} value={m.value}>
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={selectedYear}
                          onValueChange={(v) => {
                            setSelectedYear(v);
                            if (selectedMonth) setDateFilter("month");
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((y) => (
                              <SelectItem key={y} value={y}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>By Year Only</Label>
                      <Select
                        value={dateFilter === "year" ? selectedYear : ""}
                        onValueChange={(v) => {
                          setSelectedYear(v);
                          setDateFilter("year");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Custom Range</Label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => {
                            setCustomStartDate(e.target.value);
                            setDateFilter("custom");
                          }}
                          className="flex-1"
                        />
                        <span className="self-center text-muted-foreground">
                          to
                        </span>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => {
                            setCustomEndDate(e.target.value);
                            setDateFilter("custom");
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex-1" />

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={exporting || filteredTransactions.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exporting ? "Exporting..." : "Export"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export to Excel (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export to PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        tx.type === "INCOME"
                          ? "bg-green-500/10"
                          : "bg-red-500/10"
                      )}
                    >
                      {tx.type === "INCOME" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.description || tx.walletName} •{" "}
                        {new Date(tx.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p
                      className={cn(
                        "font-semibold",
                        tx.type === "INCOME"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingTransaction(tx);
                            setModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(tx.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        transaction={editingTransaction}
        wallets={wallets}
        onSuccess={() => {
          setModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
