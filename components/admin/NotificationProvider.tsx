"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface NotificationCounts {
  contact: number;
  comments: number;
  chat: number;
  bills: {
    overdue: number;
    pending: number;
    total: number;
  };
  tasks: {
    overdue: number;
    dueToday: number;
    total: number;
  };
  calendar: {
    today: number;
    upcoming: number;
    total: number;
  };
  totalUnread: number;
}

interface NotificationItem {
  id: string;
  type: "contact" | "chat" | "comment" | "bill" | "task" | "calendar";
  title: string;
  message: string;
  timestamp: Date;
  link: string;
}

interface NotificationContextType {
  counts: NotificationCounts;
  newNotification: NotificationItem | null;
  refreshCounts: () => void;
  clearNewNotification: () => void;
}

const defaultCounts: NotificationCounts = {
  contact: 0,
  comments: 0,
  chat: 0,
  bills: { overdue: 0, pending: 0, total: 0 },
  tasks: { overdue: 0, dueToday: 0, total: 0 },
  calendar: { today: 0, upcoming: 0, total: 0 },
  totalUnread: 0,
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [counts, setCounts] = useState<NotificationCounts>(defaultCounts);
  const [previousCounts, setPreviousCounts] =
    useState<NotificationCounts>(defaultCounts);
  const [newNotification, setNewNotification] =
    useState<NotificationItem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/counts");
      if (res.ok) {
        const data = await res.json();

        // Check for new notifications (only after initial load)
        if (isInitialized) {
          // New contact submission
          if (data.contact > previousCounts.contact) {
            setNewNotification({
              id: Date.now().toString(),
              type: "contact",
              title: "Pesan Baru!",
              message: "Ada pesan baru dari contact form",
              timestamp: new Date(),
              link: "/dashboard/services",
            });
          }
          // New comment
          else if (data.comments > previousCounts.comments) {
            setNewNotification({
              id: Date.now().toString(),
              type: "comment",
              title: "Komentar Baru!",
              message: "Ada komentar baru di blog",
              timestamp: new Date(),
              link: "/dashboard/comments",
            });
          }
          // New chat
          else if (data.chat > previousCounts.chat) {
            setNewNotification({
              id: Date.now().toString(),
              type: "chat",
              title: "Chat Baru!",
              message: "Ada chat yang menunggu balasan",
              timestamp: new Date(),
              link: "/dashboard/chat",
            });
          }
          // New overdue bill
          else if (data.bills.overdue > previousCounts.bills.overdue) {
            setNewNotification({
              id: Date.now().toString(),
              type: "bill",
              title: "Tagihan Jatuh Tempo!",
              message: "Ada tagihan yang sudah melewati jatuh tempo",
              timestamp: new Date(),
              link: "/dashboard/finance/bills",
            });
          }
          // New overdue task
          else if (data.tasks.overdue > previousCounts.tasks.overdue) {
            setNewNotification({
              id: Date.now().toString(),
              type: "task",
              title: "Task Overdue!",
              message: "Ada task yang melewati deadline",
              timestamp: new Date(),
              link: "/dashboard/tasks",
            });
          }
          // Task due today
          else if (data.tasks.dueToday > previousCounts.tasks.dueToday) {
            setNewNotification({
              id: Date.now().toString(),
              type: "task",
              title: "Task Hari Ini!",
              message: "Ada task yang harus diselesaikan hari ini",
              timestamp: new Date(),
              link: "/dashboard/tasks",
            });
          }
          // Calendar event today
          else if (data.calendar.today > previousCounts.calendar.today) {
            setNewNotification({
              id: Date.now().toString(),
              type: "calendar",
              title: "Event Hari Ini!",
              message: "Ada event yang dijadwalkan hari ini",
              timestamp: new Date(),
              link: "/dashboard/calendar",
            });
          }
        }

        setPreviousCounts(data);
        setCounts(data);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  }, [isInitialized, previousCounts]);

  // Initial fetch
  useEffect(() => {
    fetchCounts();
  }, []);

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [fetchCounts]);

  const clearNewNotification = () => {
    setNewNotification(null);
  };

  const value: NotificationContextType = {
    counts,
    newNotification,
    refreshCounts: fetchCounts,
    clearNewNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
