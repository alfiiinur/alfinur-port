"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Reply,
  Trash2,
  ExternalLink,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Frown,
  Angry,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Reaction {
  id: string;
  type: string;
}

interface ReplyType {
  id: string;
  name: string;
  message: string;
  isAdminReply: boolean;
  createdAt: string | Date;
  admin?: { name: string } | null;
  reactions?: Reaction[];
}

interface Comment {
  id: string;
  name: string;
  message: string;
  ipAddress: string;
  isAdminReply: boolean;
  approved: boolean;
  createdAt: string | Date;
  blog: { title: string; slug: string };
  replies: ReplyType[];
  reactions?: Reaction[];
}

const REACTION_ICONS: Record<string, { icon: typeof ThumbsUp; color: string }> =
  {
    LIKE: { icon: ThumbsUp, color: "text-blue-500" },
    DISLIKE: { icon: ThumbsDown, color: "text-gray-500" },
    LOVE: { icon: Heart, color: "text-red-500" },
    LAUGH: { icon: Laugh, color: "text-yellow-500" },
    SAD: { icon: Frown, color: "text-purple-500" },
    ANGRY: { icon: Angry, color: "text-orange-500" },
  };

interface CommentsTableProps {
  comments: Comment[];
}

export default function CommentsTable({ comments }: CommentsTableProps) {
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async (commentId: string) => {
    if (!replyMessage.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/comments/${commentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });

      if (res.ok) {
        setReplyMessage("");
        setReplyingTo(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to reply");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReply = async (replyId: string) => {
    if (!editMessage.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/comments/${replyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editMessage.trim() }),
      });

      if (res.ok) {
        setEditMessage("");
        setEditingReply(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to edit reply");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm("Yakin ingin menghapus balasan ini?")) return;

    try {
      const res = await fetch(`/api/comments/${replyId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete reply");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (
      !confirm("Yakin ingin menghapus komentar ini beserta semua balasannya?")
    )
      return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete");
    }
  };

  const openEditDialog = (reply: ReplyType) => {
    setEditingReply(reply.id);
    setEditMessage(reply.message);
  };

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Belum ada komentar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {comment.name}
                  <Badge variant="outline" className="text-xs font-normal">
                    {comment.ipAddress}
                  </Badge>
                </CardTitle>
                <Link
                  href={`/blogs/${comment.blog.slug}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                  target="_blank"
                >
                  {comment.blog.title}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: id,
                })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
              {comment.message}
            </p>

            {/* Reactions Summary */}
            {comment.reactions && comment.reactions.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
                <span className="text-xs text-muted-foreground mr-1">
                  Reactions:
                </span>
                {Object.entries(
                  comment.reactions.reduce((acc, r) => {
                    acc[r.type] = (acc[r.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => {
                  const config = REACTION_ICONS[type];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <div key={type} className="flex items-center gap-0.5">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Replies with edit/delete buttons */}
            {comment.replies.length > 0 && (
              <div className="ml-4 pl-4 border-l-2 space-y-2 mb-4">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-3 rounded-lg ${
                      reply.isAdminReply ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {reply.isAdminReply
                            ? reply.admin?.name || "Admin"
                            : reply.name}
                        </span>
                        <Badge
                          variant={reply.isAdminReply ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {reply.isAdminReply ? "Admin" : "User"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {reply.isAdminReply && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => openEditDialog(reply)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteReply(reply.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reply.message}
                    </p>

                    {/* Reply Reactions */}
                    {reply.reactions && reply.reactions.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {Object.entries(
                          reply.reactions.reduce((acc, r) => {
                            acc[r.type] = (acc[r.type] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([type, count]) => {
                          const config = REACTION_ICONS[type];
                          if (!config) return null;
                          const Icon = config.icon;
                          return (
                            <div
                              key={type}
                              className="flex items-center gap-0.5"
                            >
                              <Icon className={`w-3 h-3 ${config.color}`} />
                              <span className="text-xs">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Dialog
                open={replyingTo === comment.id}
                onOpenChange={(open) => {
                  if (!open) {
                    setReplyingTo(null);
                    setReplyMessage("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Balas
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Balas Komentar</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">{comment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {comment.message}
                      </p>
                    </div>
                    <Textarea
                      placeholder="Tulis balasan..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={4}
                      maxLength={500}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setReplyingTo(null)}
                      >
                        Batal
                      </Button>
                      <Button
                        onClick={() => handleReply(comment.id)}
                        disabled={loading || !replyMessage.trim()}
                      >
                        {loading ? "Mengirim..." : "Kirim Balasan"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Hapus
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Reply Dialog */}
      <Dialog
        open={editingReply !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingReply(null);
            setEditMessage("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Balasan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Edit balasan..."
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingReply(null)}>
                Batal
              </Button>
              <Button
                onClick={() => editingReply && handleEditReply(editingReply)}
                disabled={loading || !editMessage.trim()}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
