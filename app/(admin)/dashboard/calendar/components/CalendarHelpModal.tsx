"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle,
  Calendar,
  Plus,
  MousePointer,
  Keyboard,
  Search,
  Settings,
  Trash2,
  Edit,
  Move,
} from "lucide-react";

interface CalendarHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: "T", description: "Pergi ke hari ini" },
  { key: "D", description: "Tampilan Hari" },
  { key: "W", description: "Tampilan Minggu" },
  { key: "M", description: "Tampilan Bulan" },
  { key: "←", description: "Periode sebelumnya" },
  { key: "→", description: "Periode berikutnya" },
  { key: "N", description: "Buat event baru" },
  { key: "/", description: "Fokus ke pencarian" },
  { key: "Esc", description: "Tutup modal/dialog" },
];

const features = [
  {
    icon: Plus,
    title: "Membuat Event",
    description:
      "Klik tombol '+' atau klik langsung pada tanggal di kalender untuk membuat event baru.",
  },
  {
    icon: Edit,
    title: "Edit Event",
    description:
      "Klik pada event yang sudah ada untuk melihat detail dan mengeditnya.",
  },
  {
    icon: Move,
    title: "Pindahkan Event",
    description:
      "Drag & drop event untuk memindahkannya ke tanggal atau waktu lain.",
  },
  {
    icon: Trash2,
    title: "Hapus Event",
    description:
      "Buka detail event dan klik tombol hapus untuk menghapus event.",
  },
  {
    icon: Search,
    title: "Cari Event",
    description:
      "Gunakan kotak pencarian untuk menemukan event berdasarkan judul atau deskripsi.",
  },
  {
    icon: Settings,
    title: "Pengaturan",
    description:
      "Klik ikon gear untuk mengatur preferensi kalender seperti zona waktu, format jam, dll.",
  },
];

export default function CalendarHelpModal({
  isOpen,
  onClose,
}: CalendarHelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Bantuan Kalender
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Start */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-primary" />
              Mulai Cepat
            </div>
            <p className="text-sm text-muted-foreground">
              Kalender ini membantu Anda mengatur jadwal dan event. Anda bisa
              melihat kalender dalam tampilan hari, minggu, atau bulan. Semua
              event akan tersimpan dan bisa disinkronkan dengan Google Calendar.
            </p>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MousePointer className="h-4 w-4 text-primary" />
              Fitur Utama
            </div>
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Keyboard className="h-4 w-4 text-primary" />
              Pintasan Keyboard
            </div>
            <div className="grid grid-cols-2 gap-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                >
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-background border rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tips */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">💡 Tips</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Gunakan warna berbeda untuk membedakan jenis event (kerja,
                pribadi, dll.)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Aktifkan notifikasi reminder agar tidak lupa event penting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Sinkronkan dengan Google Calendar untuk akses dari mana saja
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Gunakan tampilan Agenda untuk melihat daftar event yang akan
                datang
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Mengerti</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
