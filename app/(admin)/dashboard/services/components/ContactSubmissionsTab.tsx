"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  budget: string | null;
  timeline: string | null;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  notes: string | null;
  createdAt: string;
}

const statusColors = {
  NEW: "bg-blue-500",
  READ: "bg-yellow-500",
  REPLIED: "bg-green-500",
  ARCHIVED: "bg-gray-500",
};

const statusLabels = {
  NEW: "Baru",
  READ: "Dibaca",
  REPLIED: "Dibalas",
  ARCHIVED: "Arsip",
};

export default function ContactSubmissionsTab() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFormType, setFilterFormType] = useState<string>("all");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    submission: ContactSubmission | null;
  }>({
    open: false,
    submission: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === "all"
          ? "/api/contact"
          : `/api/contact?status=${filterStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  // Filter submissions by form type
  const filteredSubmissions = submissions.filter((s) => {
    if (filterFormType === "all") return true;
    if (filterFormType === "simple") return s.service === "General Inquiry";
    if (filterFormType === "detail") return s.service !== "General Inquiry";
    return true;
  });

  const handleViewDetail = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setNotes(submission.notes || "");
    setIsDetailOpen(true);

    // Mark as read if new
    if (submission.status === "NEW") {
      updateStatus(submission.id, "READ");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({
          ...selectedSubmission,
          status: status as ContactSubmission["status"],
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!selectedSubmission) return;
    setUpdating(true);
    try {
      await fetch(`/api/contact/${selectedSubmission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      setSelectedSubmission({ ...selectedSubmission, notes });
      fetchSubmissions();
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.submission) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/contact/${deleteModal.submission.id}`, {
        method: "DELETE",
      });
      fetchSubmissions();
      if (selectedSubmission?.id === deleteModal.submission.id) {
        setIsDetailOpen(false);
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false, submission: null });
    }
  };

  const newCount = filteredSubmissions.filter((s) => s.status === "NEW").length;
  const simpleCount = submissions.filter(
    (s) => s.service === "General Inquiry"
  ).length;
  const detailCount = submissions.filter(
    (s) => s.service !== "General Inquiry"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Contact Submissions</h2>
          <p className="text-sm text-muted-foreground">
            {newCount > 0 && (
              <span className="text-blue-500 font-medium">
                {newCount} pesan baru •{" "}
              </span>
            )}
            Total {filteredSubmissions.length} submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Form Type Filter */}
          <Select value={filterFormType} onValueChange={setFilterFormType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Form type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Form</SelectItem>
              <SelectItem value="detail">Detail ({detailCount})</SelectItem>
              <SelectItem value="simple">Simple ({simpleCount})</SelectItem>
            </SelectContent>
          </Select>
          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="NEW">Baru</SelectItem>
              <SelectItem value="READ">Dibaca</SelectItem>
              <SelectItem value="REPLIED">Dibalas</SelectItem>
              <SelectItem value="ARCHIVED">Arsip</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchSubmissions}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Layanan</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Belum ada submissions
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className={
                    submission.status === "NEW"
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{submission.service}</span>
                      {submission.service === "General Inquiry" && (
                        <Badge variant="secondary" className="text-xs">
                          Simple
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{submission.budget || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusColors[submission.status]
                      } text-white`}
                    >
                      {statusLabels[submission.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(submission.createdAt), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewDetail(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() =>
                          setDeleteModal({ open: true, submission })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nama</p>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-medium text-blue-500 hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                {selectedSubmission.phone && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${selectedSubmission.phone.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      className="font-medium text-green-500 hover:underline"
                    >
                      {selectedSubmission.phone}
                    </a>
                  </div>
                )}
                {selectedSubmission.company && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building className="h-3 w-3" /> Perusahaan
                    </p>
                    <p className="font-medium">{selectedSubmission.company}</p>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedSubmission.service}</Badge>
                  {selectedSubmission.budget && (
                    <Badge variant="outline">{selectedSubmission.budget}</Badge>
                  )}
                  {selectedSubmission.timeline && (
                    <Badge variant="outline">
                      {selectedSubmission.timeline}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(
                    new Date(selectedSubmission.createdAt),
                    "EEEE, dd MMMM yyyy 'pukul' HH:mm",
                    { locale: id }
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Pesan</Label>
                <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value) =>
                    updateStatus(selectedSubmission.id, value)
                  }
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Baru</SelectItem>
                    <SelectItem value="READ">Dibaca</SelectItem>
                    <SelectItem value="REPLIED">Dibalas</SelectItem>
                    <SelectItem value="ARCHIVED">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label>Catatan Admin</Label>
                <Textarea
                  placeholder="Tambahkan catatan internal..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
                <Button size="sm" onClick={saveNotes} disabled={updating}>
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Simpan Catatan
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button asChild variant="outline" className="flex-1">
                  <a href={`mailto:${selectedSubmission.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Kirim Email
                  </a>
                </Button>
                {selectedSubmission.phone && (
                  <Button asChild variant="outline" className="flex-1">
                    <a
                      href={`https://wa.me/${selectedSubmission.phone.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) =>
          setDeleteModal({
            open,
            submission: open ? deleteModal.submission : null,
          })
        }
        onConfirm={handleDelete}
        title="Hapus Submission"
        itemName={deleteModal.submission?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
