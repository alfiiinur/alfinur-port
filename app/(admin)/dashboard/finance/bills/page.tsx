"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Receipt,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import BillModal from "./components/BillModal";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  description?: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  isRecurring: boolean;
  recurringType?: string;
}

type DateFilterType = "all" | "thisMonth" | "nextMonth" | "custom";

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/finance/bills");
      if (res.ok) setBills(await res.json());
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    try {
      const res = await fetch(`/api/finance/bills/${id}`, { method: "DELETE" });
      if (res.ok) setBills(bills.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const res = await fetch(`/api/finance/bills/${id}/pay`, {
        method: "POST",
      });
      if (res.ok) fetchBills();
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) =>
      (currentYear - i + 1).toString()
    );
  }, []);

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

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      PAID: "bg-green-500/10 text-green-600 dark:text-green-400",
      OVERDUE: "bg-red-500/10 text-red-600 dark:text-red-400",
      CANCELLED: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4" />;
      case "OVERDUE":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchSearch = bill.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || bill.status === statusFilter;

      let matchDate = true;
      const dueDate = new Date(bill.dueDate);
      const today = new Date();

      switch (dateFilter) {
        case "thisMonth":
          matchDate =
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear();
          break;
        case "nextMonth":
          const nextMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            1
          );
          matchDate =
            dueDate.getMonth() === nextMonth.getMonth() &&
            dueDate.getFullYear() === nextMonth.getFullYear();
          break;
        case "custom":
          if (selectedMonth && selectedYear) {
            matchDate =
              dueDate.getMonth() === parseInt(selectedMonth) - 1 &&
              dueDate.getFullYear() === parseInt(selectedYear);
          }
          break;
      }
      return matchSearch && matchStatus && matchDate;
    });
  }, [bills, search, statusFilter, dateFilter, selectedMonth, selectedYear]);

  const stats = useMemo(
    () => ({
      total: filteredBills.length,
      pending: filteredBills.filter((b) => b.status === "PENDING").length,
      overdue: filteredBills.filter((b) => b.status === "OVERDUE").length,
      totalAmount: filteredBills
        .filter((b) => b.status === "PENDING" || b.status === "OVERDUE")
        .reduce((sum, b) => sum + b.amount, 0),
    }),
    [filteredBills]
  );

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case "thisMonth":
        return "This Month";
      case "nextMonth":
        return "Next Month";
      case "custom":
        if (selectedMonth && selectedYear) {
          const monthName = months.find(
            (m) => m.value === selectedMonth
          )?.label;
          return `${monthName} ${selectedYear}`;
        }
        return "Select Period";
      default:
        return "All Time";
    }
  };

  const clearDateFilter = () => {
    setDateFilter("all");
    setSelectedMonth("");
    setSelectedYear("");
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const data = filteredBills.map((bill) => ({
        Name: bill.name,
        Category: bill.category,
        "Due Date": new Date(bill.dueDate).toLocaleDateString("id-ID"),
        Amount: bill.amount,
        Status: bill.status,
        Recurring: bill.isRecurring ? bill.recurringType : "No",
      }));

      data.push({
        Name: "",
        Category: "",
        "Due Date": "",
        Amount: stats.totalAmount,
        Status: "TOTAL TO PAY",
        Recurring: "",
      });

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

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bills_${getDateFilterLabel().replace(/\s/g, "_")}.csv`;
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
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bills Report - ${getDateFilterLabel()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; margin-bottom: 5px; }
            .subtitle { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .pending { color: #ca8a04; }
            .paid { color: #16a34a; }
            .overdue { color: #dc2626; }
            .summary { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
            .amount-right { text-align: right; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h1>Bills Report</h1>
          <p class="subtitle">Period: ${getDateFilterLabel()}</p>
          <div class="summary">
            <p><strong>Total Bills:</strong> ${
              stats.total
            } | <strong>Pending:</strong> ${
        stats.pending
      } | <strong>Overdue:</strong> ${stats.overdue}</p>
            <p><strong>Total Amount to Pay:</strong> ${formatCurrency(
              stats.totalAmount
            )}</p>
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Category</th><th>Due Date</th><th>Status</th><th class="amount-right">Amount</th></tr>
            </thead>
            <tbody>
              ${filteredBills
                .map(
                  (bill) => `
                <tr>
                  <td>${bill.name}${
                    bill.isRecurring
                      ? ` <small>(${bill.recurringType})</small>`
                      : ""
                  }</td>
                  <td>${bill.category}</td>
                  <td>${new Date(bill.dueDate).toLocaleDateString("id-ID")}</td>
                  <td class="${bill.status.toLowerCase()}">${bill.status}</td>
                  <td class="amount-right">${formatCurrency(bill.amount)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <p style="margin-top: 30px; color: #999; font-size: 12px;">Generated on ${new Date().toLocaleString(
            "id-ID"
          )}</p>
        </body>
        </html>
      `;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bills</h1>
          <p className="text-muted-foreground">
            Manage your bills and payments
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingBill(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bill
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-xl font-bold">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">To Pay</p>
                <p className="text-xl font-bold">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
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
              <PopoverContent className="w-72" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quick Filters</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "all", label: "All Time" },
                        { value: "thisMonth", label: "This Month" },
                        { value: "nextMonth", label: "Next Month" },
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
                          setDateFilter("custom");
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
                          if (selectedMonth) setDateFilter("custom");
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
                </div>
              </PopoverContent>
            </Popover>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  disabled={exporting || filteredBills.length === 0}
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
        </CardContent>
      </Card>

      {/* Bills List */}
      <Card>
        <CardHeader>
          <CardTitle>Bills ({filteredBills.length})</CardTitle>
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
          ) : filteredBills.length > 0 ? (
            <div className="space-y-3">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{bill.name}</p>
                        {bill.isRecurring && (
                          <Badge variant="outline" className="text-xs">
                            {bill.recurringType?.toLowerCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Due:{" "}
                          {new Date(bill.dueDate).toLocaleDateString("id-ID")}
                        </span>
                        <span>•</span>
                        <span>{bill.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(bill.amount)}
                      </p>
                      <Badge
                        className={cn("text-xs", getStatusBadge(bill.status))}
                      >
                        {getStatusIcon(bill.status)}
                        <span className="ml-1">{bill.status}</span>
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {bill.status !== "PAID" && (
                          <DropdownMenuItem
                            onClick={() => handleMarkPaid(bill.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingBill(bill);
                            setModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(bill.id)}
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
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No bills found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill Modal */}
      <BillModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        bill={editingBill}
        onSuccess={() => {
          setModalOpen(false);
          fetchBills();
        }}
      />
    </div>
  );
}
