"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, Check, AlertCircle } from "lucide-react";

interface GoogleCalendarSyncProps {
  onSync?: () => void;
}

export default function GoogleCalendarSync({
  onSync,
}: GoogleCalendarSyncProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = () => {
    // Google Calendar OAuth flow
    // This would redirect to Google OAuth consent screen
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/calendar/google/callback`;
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
    );

    if (!clientId) {
      alert(
        "Google Calendar integration is not configured. Please add GOOGLE_CLIENT_ID to your environment variables."
      );
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = authUrl;
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/calendar/google/sync", {
        method: "POST",
      });

      if (res.ok) {
        onSync?.();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Google Calendar
      </h3>

      {isConnected ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Connected
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Now
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Connect to sync events and receive notifications on your phone
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleConnect}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Connect Google Calendar
          </Button>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
            <span>
              Events will sync to your Google Calendar and you&apos;ll receive
              notifications on all your devices
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
