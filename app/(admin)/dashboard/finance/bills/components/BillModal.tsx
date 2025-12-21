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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: Bill | null;
  onSuccess: () => void;
}

const BILL_CATEGORIES = [
  "Electricity",
  "Water",
  "Internet",
  "Phone",
  "Rent",
  "Insurance",
  "Subscription",
  "Credit Card",
  "Loan",
  "Others",
];

export default function BillModal({
  open,
  onOpenChange,
  bill,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
    description: "",
    isRecurring: false,
    recurringType: "MONTHLY",
    reminder: "3",
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        amount: bill.amount.toString(),
        dueDate: bill.dueDate.split("T")[0],
        category: bill.category,
        description: bill.description || "",
        isRecurring: bill.isRecurring,
        recurringType: bill.recurringType || "MONTHLY",
        reminder: "3",
      });
    } else {
      setFormData({
        name: "",
        amount: "",
        dueDate: "",
        category: "",
        description: "",
        isRecurring: false,
        recurringType: "MONTHLY",
        reminder: "3",
      });
    }
  }, [bill, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = bill ? `/api/finance/bills/${bill.id}` : "/api/finance/bills";
      const method = bill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          reminder: parseInt(formData.reminder),
        }),
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save bill:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{bill ? "Edit Bill" : "Add Bill"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name</Label>
            <Input
              id="name"
              placeholder="e.g., Electricity Bill"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
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
                {BILL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recurring Bill</Label>
              <p className="text-sm text-muted-foreground">
                Automatically create next bill
              </p>
            </div>
            <Switch
              checked={formData.isRecurring}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isRecurring: checked })
              }
            />
          </div>

          {formData.isRecurring && (
            <div className="space-y-2">
              <Label>Repeat</Label>
              <Select
                value={formData.recurringType}
                onValueChange={(value) =>
                  setFormData({ ...formData, recurringType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes..."
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
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : bill ? "Update" : "Add Bill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
