"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Key,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";

type Session = {
  id: string;
  deviceName: string | null;
  deviceType: string | null;
  browser: string | null;
  ipAddress: string | null;
  lastActive: string;
  isCurrentSession: boolean;
};

type LoginHistory = {
  id: string;
  ipAddress: string | null;
  browser: string | null;
  device: string | null;
  location: string | null;
  status: "SUCCESS" | "FAILED";
  createdAt: string;
};

export default function SecurityPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, historyRes] = await Promise.all([
        fetch("/api/user/sessions"),
        fetch("/api/user/login-history"),
      ]);
      const sessionsData = await sessionsRes.json();
      const historyData = await historyRes.json();
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setLoginHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(data.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to revoke this session?")) return;
    try {
      await fetch(`/api/user/sessions?id=${sessionId}`, { method: "DELETE" });
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error("Error revoking session:", error);
    }
  };

  const revokeAllSessions = async () => {
    if (!confirm("Are you sure you want to log out from all other devices?"))
      return;
    try {
      await fetch("/api/user/sessions?id=all", { method: "DELETE" });
      setSessions(sessions.filter((s) => s.isCurrentSession));
    } catch (error) {
      console.error("Error revoking sessions:", error);
    }
  };

  const getDeviceIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security and sessions
        </p>
      </div>

      <div className="grid gap-6">
        {/* Change Password */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </h2>
          <div className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={
                changingPassword ||
                !passwordForm.currentPassword ||
                !passwordForm.newPassword
              }
              className="w-fit"
            >
              {changingPassword && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Update Password
            </Button>
          </div>
        </Card>

        {/* Active Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Active Sessions
            </h2>
            {sessions.length > 1 && (
              <Button variant="outline" size="sm" onClick={revokeAllSessions}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out all other devices
              </Button>
            )}
          </div>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No active sessions found</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {session.browser || "Unknown Browser"}
                        </span>
                        {session.isCurrentSession && (
                          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.ipAddress || "Unknown IP"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.lastActive).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrentSession && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Login History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Login History
          </h2>
          {loginHistory.length === 0 ? (
            <p className="text-muted-foreground">No login history found</p>
          ) : (
            <div className="space-y-2">
              {loginHistory.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {log.status === "SUCCESS" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <div className="text-sm">
                        {log.browser || "Unknown"} •{" "}
                        {log.device || "Unknown Device"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.ipAddress} {log.location && `• ${log.location}`}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
