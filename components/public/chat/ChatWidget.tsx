"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Paperclip,
  FileText,
  Download,
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
}

interface ChatSession {
  id: string;
  messages: Message[];
  status: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>(
    []
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSession = useCallback(async (sessionId?: string) => {
    try {
      const url = sessionId ? `/api/chat?sessionId=${sessionId}` : "/api/chat";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        localStorage.setItem("chatSessionId", data.id);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const savedSessionId = localStorage.getItem("chatSessionId");
      const savedName = localStorage.getItem("chatVisitorName");
      if (savedName) {
        setVisitorName(savedName);
        setShowForm(false);
      }
      if (savedSessionId) {
        await fetchSession(savedSessionId);
      }
    };
    init();
  }, [fetchSession]);

  useEffect(() => {
    if (!session?.id || !isOpen) return;
    const interval = setInterval(() => fetchSession(session.id), 3000);
    return () => clearInterval(interval);
  }, [session?.id, isOpen, fetchSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const startChat = async () => {
    if (!visitorName.trim()) return;
    setLoading(true);
    localStorage.setItem("chatVisitorName", visitorName);
    await fetchSession();
    setShowForm(false);
    setLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !session?.id) return;

    setUploading(true);
    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", session.id);

      try {
        const res = await fetch("/api/chat/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          newAttachments.push(data);
        }
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
    if ((!message.trim() && pendingAttachments.length === 0) || !session?.id)
      return;

    const content = message;
    const attachments = pendingAttachments.map((a) => a.url);
    setMessage("");
    setPendingAttachments([]);

    const tempMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "VISITOR",
      attachments,
      createdAt: new Date().toISOString(),
    };
    setSession((prev) =>
      prev ? { ...prev, messages: [...prev.messages, tempMessage] } : null
    );

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          content,
          attachments,
          visitorName,
          visitorEmail: visitorEmail || undefined,
        }),
      });
      await fetchSession(session.id);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
            className="max-w-[200px] max-h-[150px] rounded-lg cursor-pointer hover:opacity-80"
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
        className="flex items-center gap-2 p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-sm"
      >
        <FileText className="w-4 h-4" />
        <span className="truncate max-w-[150px]">{url.split("/").pop()}</span>
        <Download className="w-4 h-4" />
      </a>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <>
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
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

      <div
        className={`fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl transition-all flex flex-col ${
          isMinimized ? "w-72 h-14" : "w-80 sm:w-96 h-[500px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-800 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium text-white">Live Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-neutral-400 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {showForm ? (
              <div className="p-4 flex flex-col gap-4 flex-1 justify-center">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Halo! 👋</h3>
                  <p className="text-neutral-400 text-sm">
                    Masukkan nama untuk memulai chat
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Nama Anda *"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email (opsional)"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={startChat}
                  disabled={!visitorName.trim() || loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white rounded-lg font-medium"
                >
                  {loading ? "Memulai..." : "Mulai Chat"}
                </button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {session?.messages.length === 0 && (
                    <div className="text-center text-neutral-500 py-8">
                      <p>Halo {visitorName}! 👋</p>
                      <p className="text-sm mt-1">Ada yang bisa kami bantu?</p>
                    </div>
                  )}
                  {session?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "VISITOR"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.sender === "VISITOR"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : msg.sender === "AI"
                            ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 rounded-bl-md"
                            : "bg-neutral-700 text-white rounded-bl-md"
                        }`}
                      >
                        {msg.sender !== "VISITOR" && (
                          <span className="text-xs opacity-70 block mb-1">
                            {msg.sender === "AI" ? "🤖 AI" : "Admin"}
                          </span>
                        )}
                        {msg.content && (
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </p>
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
                  <div className="px-4 py-2 border-t border-neutral-700 flex gap-2 flex-wrap">
                    {pendingAttachments.map((att, i) => (
                      <div key={i} className="relative group">
                        {att.isImage ? (
                          <img
                            src={att.url}
                            alt={att.filename}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-neutral-800 rounded flex items-center justify-center">
                            <FileText className="w-6 h-6 text-neutral-400" />
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

                {/* Input */}
                <div className="p-4 border-t border-neutral-700 shrink-0">
                  <div className="flex gap-2 items-center">
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
                      className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full"
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
                      className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={
                        !message.trim() && pendingAttachments.length === 0
                      }
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white rounded-full"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
