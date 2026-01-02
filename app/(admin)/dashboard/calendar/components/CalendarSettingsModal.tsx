"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CalendarSettings,
  DEFAULT_CALENDAR_SETTINGS,
  ViewMode,
  FirstDayOfWeek,
  TimeFormat,
} from "../types";
import { Globe, Clock, Calendar, Eye, Flag } from "lucide-react";

interface CalendarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalendarSettings;
  onSave: (settings: CalendarSettings) => void;
}

const TIMEZONES = [
  { value: "auto", label: "Otomatis (ikuti perangkat)" },
  { value: "Asia/Jakarta", label: "WIB - Jakarta (GMT+7)" },
  { value: "Asia/Makassar", label: "WITA - Makassar (GMT+8)" },
  { value: "Asia/Jayapura", label: "WIT - Jayapura (GMT+9)" },
  { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Europe/London", label: "London (GMT+0)" },
  { value: "America/New_York", label: "New York (GMT-5)" },
];

export default function CalendarSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: CalendarSettingsModalProps) {
  const [localSettings, setLocalSettings] =
    useState<CalendarSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_CALENDAR_SETTINGS);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Pengaturan Kalender
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* General Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Globe className="h-4 w-4" />
              Pengaturan Umum
            </div>

            {/* First Day of Week */}
            <div className="flex items-center justify-between">
              <Label htmlFor="firstDay" className="flex-1">
                Hari pertama minggu
              </Label>
              <Select
                value={localSettings.firstDayOfWeek}
                onValueChange={(value: FirstDayOfWeek) =>
                  setLocalSettings({ ...localSettings, firstDayOfWeek: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Minggu</SelectItem>
                  <SelectItem value="monday">Senin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="flex items-center justify-between">
              <Label htmlFor="timezone" className="flex-1">
                Zona waktu
              </Label>
              <Select
                value={localSettings.timezone}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, timezone: value })
                }
              >
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Time & View Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Clock className="h-4 w-4" />
              Waktu & Tampilan
            </div>

            {/* Time Format */}
            <div className="flex items-center justify-between">
              <Label htmlFor="timeFormat" className="flex-1">
                Format jam
              </Label>
              <Select
                value={localSettings.timeFormat}
                onValueChange={(value: TimeFormat) =>
                  setLocalSettings({ ...localSettings, timeFormat: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 jam (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 jam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Default View */}
            <div className="flex items-center justify-between">
              <Label htmlFor="defaultView" className="flex-1">
                Tampilan default
              </Label>
              <Select
                value={localSettings.defaultView}
                onValueChange={(value: ViewMode) =>
                  setLocalSettings({ ...localSettings, defaultView: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Hari</SelectItem>
                  <SelectItem value="3day">3 Hari</SelectItem>
                  <SelectItem value="week">Minggu</SelectItem>
                  <SelectItem value="month">Bulan</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Display Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Eye className="h-4 w-4" />
              Opsi Tampilan
            </div>

            {/* Show Week Numbers */}
            <div className="flex items-center justify-between">
              <Label htmlFor="weekNumbers" className="flex-1">
                Tampilkan nomor minggu
              </Label>
              <Switch
                id="weekNumbers"
                checked={localSettings.showWeekNumbers}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    showWeekNumbers: checked,
                  })
                }
              />
            </div>

            {/* Hide Declined Events */}
            <div className="flex items-center justify-between">
              <Label htmlFor="hideDeclined" className="flex-1">
                Sembunyikan event yang ditolak
              </Label>
              <Switch
                id="hideDeclined"
                checked={localSettings.hideDeclinedEvents}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    hideDeclinedEvents: checked,
                  })
                }
              />
            </div>

            {/* Highlight Short Events */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="highlightShort">Highlight event pendek</Label>
                <p className="text-xs text-muted-foreground">
                  Event &lt;30 menit akan lebih terlihat
                </p>
              </div>
              <Switch
                id="highlightShort"
                checked={localSettings.highlightShortEvents}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    highlightShortEvents: checked,
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Indonesian Calendar Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Flag className="h-4 w-4" />
              Kalender Indonesia
            </div>

            {/* National Holidays */}
            <div className="flex items-center justify-between">
              <Label htmlFor="nationalHolidays" className="flex-1">
                Tampilkan hari libur nasional
              </Label>
              <Switch
                id="nationalHolidays"
                checked={localSettings.showNationalHolidays}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    showNationalHolidays: checked,
                  })
                }
              />
            </div>

            {/* Cuti Bersama */}
            <div className="flex items-center justify-between">
              <Label htmlFor="cutiBersama" className="flex-1">
                Tampilkan cuti bersama
              </Label>
              <Switch
                id="cutiBersama"
                checked={localSettings.showCutiBersama}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    showCutiBersama: checked,
                  })
                }
              />
            </div>

            {/* Hijri Calendar */}
            <div className="flex items-center justify-between">
              <Label htmlFor="hijri" className="flex-1">
                Tampilkan kalender Hijriah
              </Label>
              <Switch
                id="hijri"
                checked={localSettings.showHijriCalendar}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    showHijriCalendar: checked,
                  })
                }
              />
            </div>

            {/* Javanese Calendar */}
            <div className="flex items-center justify-between">
              <Label htmlFor="javanese" className="flex-1">
                Tampilkan kalender Jawa
              </Label>
              <Switch
                id="javanese"
                checked={localSettings.showJavaneseCalendar}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    showJavaneseCalendar: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={handleReset}>
            Reset ke Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
