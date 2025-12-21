"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "./NotificationProvider";
import {
  X,
  Mail,
  MessageCircle,
  Bell,
  MessageSquare,
  Receipt,
  CheckSquare,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function NotificationAlert() {
  const { newNotification, clearNewNotification, counts } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  // Show alert when new notification arrives
  useEffect(() => {
    if (newNotification) {
      setIsVisible(true);
      // Play notification sound (optional)
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}

      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        clearNewNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [newNotification, clearNewNotification]);

  // Show badge indicator when there are unread items
  useEffect(() => {
    setShowBadge(counts.totalUnread > 0);
  }, [counts.totalUnread]);

  const handleClose = () => {
    setIsVisible(false);
    clearNewNotification();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "contact":
        return <Mail className="h-5 w-5" />;
      case "comment":
        return <MessageSquare className="h-5 w-5" />;
      case "chat":
        return <MessageCircle className="h-5 w-5" />;
      case "bill":
        return <Receipt className="h-5 w-5" />;
      case "task":
        return <CheckSquare className="h-5 w-5" />;
      case "calendar":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "contact":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400";
      case "comment":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400";
      case "chat":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400";
      case "bill":
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400";
      case "task":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400";
      case "calendar":
        return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400";
    }
  };

  const getNotificationLabel = (type: string) => {
    switch (type) {
      case "contact":
        return "Pesan";
      case "comment":
        return "Komentar";
      case "chat":
        return "Chat";
      case "bill":
        return "Tagihan";
      case "task":
        return "Task";
      case "calendar":
        return "Event";
      default:
        return "Notifikasi";
    }
  };

  // Determine which link to show in floating badge based on priority
  const getPriorityLink = () => {
    if (counts.tasks.overdue > 0) return "/dashboard/tasks";
    if (counts.bills.overdue > 0) return "/dashboard/finance/bills";
    if (counts.chat > 0) return "/dashboard/chat";
    if (counts.comments > 0) return "/dashboard/comments";
    if (counts.contact > 0) return "/dashboard/services";
    if (counts.calendar.today > 0) return "/dashboard/calendar";
    if (counts.tasks.dueToday > 0) return "/dashboard/tasks";
    return "/dashboard";
  };

  return (
    <>
      {/* Floating Notification Alert */}
      <AnimatePresence>
        {isVisible && newNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-6 z-50"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${getNotificationColor(
                    newNotification.type
                  )}`}
                >
                  {getNotificationIcon(newNotification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {newNotification.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {newNotification.message}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href={newNotification.link}
                  onClick={handleClose}
                  className="flex-1 text-center text-sm py-2 px-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Lihat {getNotificationLabel(newNotification.type)}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Badge Indicator */}
      <AnimatePresence>
        {showBadge && !isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link href={getPriorityLink()}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Bell className="h-6 w-6" />
                {counts.totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1">
                    {counts.totalUnread > 99 ? "99+" : counts.totalUnread}
                  </span>
                )}
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
