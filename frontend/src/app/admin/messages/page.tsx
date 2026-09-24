"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Inbox,
  Mail,
  Calendar,
  CheckCircle2,
  Trash2,
  Reply,
  Loader2,
  RefreshCw,
  Search,
  Send,
  Sparkles,
} from "lucide-react";

interface MessageItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  read_at?: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<MessageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // In-app reply states
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("https://portfolio-backend-kofh.onrender.com/api/v1/admin/messages", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages(data.data);
        if (data.data.length > 0) {
          setSelectedMsg((prev) =>
            prev ? data.data.find((m: MessageItem) => m.id === prev.id) || data.data[0] : data.data[0]
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/messages/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMsg?.id === id) {
          setSelectedMsg({ ...selectedMsg, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg || !replyText.trim()) return;

    setSendingReply(true);
    setReplySuccess(false);

    try {
      const token = getAuthToken();
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/messages/${selectedMsg.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          reply_message: replyText,
          subject: `Re: ${selectedMsg.subject}`,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setReplySuccess(true);
        setReplyText("");
        updateStatus(selectedMsg.id, "replied");
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSendingReply(false);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`https://portfolio-backend-kofh.onrender.com/api/v1/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (res.ok) {
        const remaining = messages.filter((m) => m.id !== id);
        setMessages(remaining);
        setSelectedMsg(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = filter === "all" ? true : m.status === filter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-blue-500" />
            <span>Messages Inbox</span>
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Reply directly from the dashboard or via your phone email.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={loading}
          className="gap-2 text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Inbox
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 w-fit">
          {["all", "new", "read", "replied"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs capitalize px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Inbox Split Pane */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Fetching messages...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-2">
          <Mail className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No Messages Found</h3>
          <p className="text-xs text-zinc-500">
            {searchTerm ? "No messages match your search." : "Your inbox is currently empty."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Messages List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[660px] overflow-y-auto pr-1">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMsg(msg);
                  setReplySuccess(false);
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                  selectedMsg?.id === msg.id
                    ? "bg-blue-600/10 border-blue-500/40"
                    : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs truncate max-w-[150px]">
                    {msg.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      msg.status === "new"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]"
                        : msg.status === "replied"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]"
                        : "text-zinc-400 text-[10px]"
                    }
                  >
                    {msg.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-medium text-zinc-300 truncate">
                  {msg.subject}
                </h4>
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1 pt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Message Reader & Reply Console */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6">
            {selectedMsg ? (
              <div className="space-y-6">
                {/* Actions Top */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Status:</span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {selectedMsg.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedMsg.status !== "read" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateStatus(selectedMsg.id, "read")}
                        className="text-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMessage(selectedMsg.id)}
                      className="text-xs gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {selectedMsg.subject}
                  </h2>
                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-3">
                    <span>From: <strong className="text-zinc-200">{selectedMsg.name}</strong></span>
                    <span>•</span>
                    <span className="text-blue-400">{selectedMsg.email}</span>
                    <span>•</span>
                    <span>{new Date(selectedMsg.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>

                {/* In-App Quick Reply Box */}
                <div className="border-t border-zinc-800/80 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Send Reply via Dashboard:</span>
                    </h3>
                    <a
                      href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Reply className="w-3 h-3" />
                      Or Reply via Phone / Mail Client
                    </a>
                  </div>

                  {replySuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reply dispatched successfully! Status updated to Replied.</span>
                    </div>
                  )}

                  <form onSubmit={handleSendReply} className="space-y-3">
                    <textarea
                      rows={3}
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write your professional response to ${selectedMsg.name}...`}
                      className="w-full p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />

                    <Button
                      type="submit"
                      size="sm"
                      disabled={sendingReply || !replyText.trim()}
                      className="gap-2 text-xs"
                    >
                      {sendingReply ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sending Reply...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Reply Directly
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 text-center py-12">
                Select an inquiry from the list.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
