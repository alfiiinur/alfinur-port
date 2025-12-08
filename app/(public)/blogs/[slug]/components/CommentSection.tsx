"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Frown,
  Angry,
  Reply,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Comment {
  id: string;
  name: string;
  message: string;
  isAdminReply: boolean;
  createdAt: string;
  admin?: { name: string } | null;
  replies?: Comment[];
}

interface ReactionCounts {
  LIKE?: number;
  DISLIKE?: number;
  LOVE?: number;
  LAUGH?: number;
  SAD?: number;
  ANGRY?: number;
}

interface CommentSectionProps {
  blogId: string;
}

const REACTION_ICONS = {
  LIKE: { icon: ThumbsUp, label: "Suka", color: "text-blue-500" },
  DISLIKE: { icon: ThumbsDown, label: "Tidak Suka", color: "text-gray-500" },
  LOVE: { icon: Heart, label: "Love", color: "text-red-500" },
  LAUGH: { icon: Laugh, label: "Haha", color: "text-yellow-500" },
  SAD: { icon: Frown, label: "Sedih", color: "text-purple-500" },
  ANGRY: { icon: Angry, label: "Marah", color: "text-orange-500" },
};

export default function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [blocked, setBlocked] = useState<Date | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComments();
    const savedName = localStorage.getItem("commentName");
    if (savedName) setName(savedName);
  }, [blogId]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?blogId=${blogId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || cooldown > 0 || blocked) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          name: name.trim(),
          message: message.trim(),
          parentId: parentId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.cooldown) setCooldown(data.remainingSeconds);
        if (data.blocked) setBlocked(new Date(data.blockedUntil));
        setError(data.error);
        return;
      }

      localStorage.setItem("commentName", name.trim());
      setSuccess(
        parentId ? "Balasan berhasil dikirim!" : "Komentar berhasil dikirim!"
      );
      setMessage("");
      setCooldown(20);
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      setError("Gagal mengirim. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const isBlocked = blocked && new Date(blocked) > new Date();

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Komentar ({comments.length})
      </h3>

      {/* Comment Form */}
      <div ref={formRef} />
      {!isBlocked ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => handleSubmit(e, replyingTo?.id)}
              className="space-y-4"
            >
              {replyingTo && (
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">
                    Membalas <strong>{replyingTo.name}</strong>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Batal
                  </Button>
                </div>
              )}
              <Input
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                required
                disabled={loading || cooldown > 0}
              />
              <Textarea
                placeholder={
                  replyingTo
                    ? "Tulis balasan..."
                    : "Tulis komentar Anda... (maks 500 karakter)"
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={4}
                required
                disabled={loading || cooldown > 0}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {message.length}/500
                </span>
                <Button
                  type="submit"
                  disabled={loading || cooldown > 0 || !name || !message}
                >
                  {loading ? (
                    "Mengirim..."
                  ) : cooldown > 0 ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Tunggu {cooldown}s
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {replyingTo ? "Kirim Balasan" : "Kirim Komentar"}
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>
                Anda telah mencapai batas komentar. Silakan coba lagi dalam 24
                jam.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReply={(id, replyName) => {
                setReplyingTo({ id, name: replyName });
                formRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              isBlocked={!!isBlocked}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CommentCardProps {
  comment: Comment;
  onReply: (id: string, name: string) => void;
  isBlocked: boolean;
}

function CommentCard({ comment, onReply, isBlocked }: CommentCardProps) {
  const [reactions, setReactions] = useState<ReactionCounts>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loadingReaction, setLoadingReaction] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [comment.id]);

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/comments/${comment.id}/reactions`);
      if (res.ok) {
        const data = await res.json();
        setReactions(data.counts);
        setUserReactions(data.userReactions);
      }
    } catch (err) {
      console.error("Failed to fetch reactions");
    }
  };

  const handleReaction = async (type: string) => {
    if (loadingReaction) return;
    setLoadingReaction(true);

    try {
      const res = await fetch(`/api/comments/${comment.id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        fetchReactions();
      }
    } catch (err) {
      console.error("Failed to add reaction");
    } finally {
      setLoadingReaction(false);
    }
  };

  const totalReactions = Object.values(reactions).reduce(
    (a, b) => a + (b || 0),
    0
  );

  return (
    <Card
      className={comment.isAdminReply ? "border-primary/50 bg-primary/5" : ""}
    >
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {comment.isAdminReply
                ? comment.admin?.name || "Admin"
                : comment.name}
            </span>
            {comment.isAdminReply && (
              <Badge variant="default" className="text-xs">
                Admin
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: id,
            })}
          </span>
        </div>
        <p className="text-muted-foreground whitespace-pre-wrap mb-3">
          {comment.message}
        </p>

        {/* Reactions */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          {Object.entries(REACTION_ICONS).map(
            ([type, { icon: Icon, label, color }]) => {
              const count = reactions[type as keyof ReactionCounts] || 0;
              const isActive = userReactions.includes(type);
              return (
                <Button
                  key={type}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-7 px-2 ${isActive ? color : ""}`}
                  onClick={() => handleReaction(type)}
                  disabled={loadingReaction}
                >
                  <Icon className="w-3.5 h-3.5 mr-1" />
                  {count > 0 && <span className="text-xs">{count}</span>}
                </Button>
              );
            }
          )}
          {!isBlocked && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 ml-2"
              onClick={() =>
                onReply(
                  comment.id,
                  comment.isAdminReply
                    ? comment.admin?.name || "Admin"
                    : comment.name
                )
              }
            >
              <Reply className="w-3.5 h-3.5 mr-1" />
              Balas
            </Button>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4 pl-4 border-l-2 space-y-3">
            {comment.replies.map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                onReply={onReply}
                isBlocked={isBlocked}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReplyCard({
  reply,
  onReply,
  isBlocked,
}: {
  reply: Comment;
  onReply: (id: string, name: string) => void;
  isBlocked: boolean;
}) {
  const [reactions, setReactions] = useState<ReactionCounts>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loadingReaction, setLoadingReaction] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [reply.id]);

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/comments/${reply.id}/reactions`);
      if (res.ok) {
        const data = await res.json();
        setReactions(data.counts);
        setUserReactions(data.userReactions);
      }
    } catch (err) {
      console.error("Failed to fetch reactions");
    }
  };

  const handleReaction = async (type: string) => {
    if (loadingReaction) return;
    setLoadingReaction(true);

    try {
      const res = await fetch(`/api/comments/${reply.id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        fetchReactions();
      }
    } catch (err) {
      console.error("Failed to add reaction");
    } finally {
      setLoadingReaction(false);
    }
  };

  return (
    <div
      className={`p-3 rounded-lg ${
        reply.isAdminReply ? "bg-primary/10" : "bg-muted"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm">
          {reply.isAdminReply ? reply.admin?.name || "Admin" : reply.name}
        </span>
        {reply.isAdminReply && (
          <Badge variant="default" className="text-xs">
            Admin
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(reply.createdAt), {
            addSuffix: true,
            locale: id,
          })}
        </span>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-2">
        {reply.message}
      </p>

      {/* Reply Reactions */}
      <div className="flex flex-wrap items-center gap-1">
        {Object.entries(REACTION_ICONS).map(([type, { icon: Icon, color }]) => {
          const count = reactions[type as keyof ReactionCounts] || 0;
          const isActive = userReactions.includes(type);
          return (
            <Button
              key={type}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={`h-6 px-1.5 ${isActive ? color : ""}`}
              onClick={() => handleReaction(type)}
              disabled={loadingReaction}
            >
              <Icon className="w-3 h-3" />
              {count > 0 && <span className="text-xs ml-0.5">{count}</span>}
            </Button>
          );
        })}
        {!isBlocked && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-1.5 ml-1"
            onClick={() =>
              onReply(
                reply.id,
                reply.isAdminReply ? reply.admin?.name || "Admin" : reply.name
              )
            }
          >
            <Reply className="w-3 h-3 mr-0.5" />
            <span className="text-xs">Balas</span>
          </Button>
        )}
      </div>
    </div>
  );
}
