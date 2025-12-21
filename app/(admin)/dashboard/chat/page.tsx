"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  CheckCircle,
  XCircle,
  Zap,
  Search,
  ToggleLeft,
  ToggleRight,
  Paperclip,
  FileText,
  Download,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface Attachment {
  url: string;
  filename: string;
  type: string;
  isImage: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: "VISITOR" | "ADMIN" | "AI";
  attachments?: string[];
  createdAt: string;
  admin?: { name: string };
}

interface ChatSession {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  visitorIp: string;
  status: "ACTIVE" | "WAITING" | "RESOLVED" | "CLOSED";
  isAiEnabled: boolean;
  createdAt: string;
  messages: Message[];
  _count?: { messages: number };
}

interface QuickReply {
  id: string;
  title: string;
  shortcut: string;
  content: string;
  category: string;
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>(
    []
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSessions();
    fetchQuickReplies();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  useEffect(() => {
    if (selectedSession) {
      fetchSessionDetail(selectedSession.id);
    }
  }, [selectedSession?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedSession?.messages]);

  const fetchSessions = async () => {
    try {
      const url =
        filter === "all"
          ? "/api/chat/admin"
          : `/api/chat/admin?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) setSessions(await res.json());
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const fetchSessionDetail = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/admin/${sessionId}`);
      if (res.ok) setSelectedSession(await res.json());
    } catch (error) {
      console.error("Failed to fetch session detail:", error);
    }
  };

  const fetchQuickReplies = async () => {
    try {
      const res = await fetch("/api/chat/quick-replies");
      if (res.ok) setQuickReplies(await res.json());
    } catch (error) {
      console.error("Failed to fetch quick replies:", error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedSession?.id) return;

    setUploading(true);
    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", selectedSession.id);

      try {
        const res = await fetch("/api/chat/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) newAttachments.push(await res.json());
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setPendingAttachments((prev) => [...prev, ...newAttachments]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (
      (!message.trim() && pendingAttachments.length === 0) ||
      !selectedSession
    )
      return;

    const content = message;
    const attachments = pendingAttachments.map((a) => a.url);
    setMessage("");
    setPendingAttachments([]);

    try {
      await fetch("/api/chat/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          content,
          attachments,
        }),
      });
      await fetchSessionDetail(selectedSession.id);
      await fetchSessions();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const updateSessionStatus = async (status: string) => {
    if (!selectedSession) return;
    try {
      await fetch(`/api/chat/admin/${selectedSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchSessions();
      await fetchSessionDetail(selectedSession.id);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleAI = async () => {
    if (!selectedSession) return;
    try {
      await fetch(`/api/chat/admin/${selectedSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAiEnabled: !selectedSession.isAiEnabled }),
      });
      await fetchSessionDetail(selectedSession.id);
    } catch (error) {
      console.error("Failed to toggle AI:", error);
    }
  };

  const useQuickReply = (reply: QuickReply) => {
    setMessage(reply.content);
    setShowQuickReplies(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (message.startsWith("/")) {
      const match = quickReplies.find(
        (r) => r.shortcut.toLowerCase() === message.toLowerCase()
      );
      if (match && e.key === "Tab") {
        e.preventDefault();
        setMessage(match.content);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-500";
      case "ACTIVE":
        return "bg-green-500";
      case "RESOLVED":
        return "bg-blue-500";
      default:
        return "bg-neutral-500";
    }
  };

  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  const renderAttachment = (url: string, index: number) => {
    if (isImageUrl(url)) {
      return (
        <button
          key={index}
          onClick={() => setPreviewImage(url)}
          className="block"
        >
          <img
            src={url}
            alt="attachment"
            className="max-w-[250px] max-h-[180px] rounded-lg cursor-pointer hover:opacity-80"
          />
        </button>
      );
    }
    return (
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 bg-neutral-700/50 rounded-lg hover:bg-neutral-600/50 text-sm"
      >
        <FileText className="w-4 h-4" />
        <span className="truncate max-w-[180px]">{url.split("/").pop()}</span>
        <Download className="w-4 h-4" />
      </a>
    );
  };

  const filteredSessions = sessions.filter((s) =>
    search
      ? s.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
        s.visitorEmail?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <>
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-neutral-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="preview"
              className="max-w-full max-h-[85vh] rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)] bg-neutral-950">
        {/* Sidebar - Sessions List */}
        <div className="w-80 border-r border-neutral-800 flex flex-col">
          <div className="p-4 border-b border-neutral-800">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Live Chat
            </h1>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm"
              />
            </div>
            <div className="flex gap-1 mt-3 flex-wrap">
              {["all", "WAITING", "ACTIVE", "RESOLVED", "CLOSED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 text-xs rounded ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {f === "all" ? "Semua" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-neutral-500">
                Tidak ada chat
              </div>
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full p-4 border-b border-neutral-800 text-left hover:bg-neutral-800/50 ${
                    selectedSession?.id === session.id ? "bg-neutral-800" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">
                      {session.visitorName || "Visitor"}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        session.status
                      )}`}
                    />
                  </div>
                  <p className="text-sm text-neutral-400 truncate mt-1">
                    {session.messages[0]?.content || "No messages"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-neutral-500">
                      {new Date(session.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    {session._count?.messages ? (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {session._count.messages}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-semibold text-white">
                    {selectedSession.visitorName || "Visitor"}
                  </h2>
                  <p className="text-sm text-neutral-400">
                    {selectedSession.visitorEmail || selectedSession.visitorIp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAI}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                      selectedSession.isAiEnabled
                        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    AI {selectedSession.isAiEnabled ? "ON" : "OFF"}
                    {selectedSession.isAiEnabled ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateSessionStatus("RESOLVED")}
                      className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
                      title="Mark Resolved"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateSessionStatus("CLOSED")}
                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                      title="Close Chat"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "VISITOR" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        msg.sender === "VISITOR"
                          ? "bg-neutral-800 text-white rounded-bl-md"
                          : msg.sender === "AI"
                          ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 rounded-br-md"
                          : "bg-blue-600 text-white rounded-br-md"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === "VISITOR" ? (
                          <User className="w-3 h-3" />
                        ) : msg.sender === "AI" ? (
                          <Bot className="w-3 h-3" />
                        ) : (
                          <span className="text-xs opacity-70">
                            {msg.admin?.name || "Admin"}
                          </span>
                        )}
                        <span className="text-xs opacity-50">
                          {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {msg.content && (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((url, i) =>
                            renderAttachment(url, i)
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Pending Attachments Preview */}
              {pendingAttachments.length > 0 && (
                <div className="px-4 py-2 border-t border-neutral-800 flex gap-2 flex-wrap">
                  {pendingAttachments.map((att, i) => (
                    <div key={i} className="relative group">
                      {att.isImage ? (
                        <img
                          src={att.url}
                          alt={att.filename}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-neutral-800 rounded flex flex-col items-center justify-center p-2">
                          <FileText className="w-6 h-6 text-neutral-400" />
                          <span className="text-xs text-neutral-500 truncate w-full text-center mt-1">
                            {att.filename}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(i)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-neutral-800 shrink-0">
                {showQuickReplies && (
                  <div className="mb-3 p-3 bg-neutral-800 rounded-lg max-h-48 overflow-y-auto">
                    <div className="text-xs text-neutral-400 mb-2">
                      Quick Replies
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          onClick={() => useQuickReply(reply)}
                          className="text-left p-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                        >
                          <span className="text-blue-400">
                            {reply.shortcut}
                          </span>
                          <span className="text-neutral-300 ml-2">
                            {reply.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    className={`p-2 rounded-lg ${
                      showQuickReplies
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                    title="Quick Replies"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx"
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="p-2 bg-neutral-800 text-neutral-400 hover:text-white rounded-lg"
                    title="Attach file"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Paperclip className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="text"
                    placeholder="Ketik pesan..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={
                      !message.trim() && pendingAttachments.length === 0
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 text-white rounded-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Tip: Ketik /shortcut lalu Tab untuk quick reply
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Pilih chat untuk memulai</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
