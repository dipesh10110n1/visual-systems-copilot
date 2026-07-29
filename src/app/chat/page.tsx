"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Send, Plus, ChevronRight, Check, Sparkles, LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  nodesAffected?: string[];
  codeSnippet?: string;
}

const mockThreads = [
  { id: "1", title: "Analyze database subnet rules", active: true },
  { id: "2", title: "Check rate limiting policy", active: false },
  { id: "3", title: "Redis cache configuration issue", active: false },
];

const suggestedPrompts = [
  "Explain Authentication Flow",
  "Summarize Architecture",
  "Find Risks",
  "Suggest Improvements",
  "Generate Documentation",
];

const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "copilot",
    text: "Hello John! I have ingested **AWS_Enterprise_Architecture.pdf**. Ask me any system engineering questions, query performance parameters, or review security recommendations.",
    timestamp: "10:30 PM",
  },
  {
    id: "m2",
    sender: "user",
    text: "Are there any single points of failure in the DB layer?",
    timestamp: "10:31 PM",
  },
  {
    id: "m3",
    sender: "copilot",
    text: "Based on my visual parsing of the architecture diagram, I detected a potential single point of failure. The **Billing Manager API** connects directly to the **Billing Aurora Cluster** without a read replica or database failover pool mapped in a separate availability zone.",
    timestamp: "10:31 PM",
    nodesAffected: ["Billing Manager API", "Billing Aurora Cluster"],
    codeSnippet: `// Suggested Terraform patch to enable Multi-AZ replication
resource "aws_rds_cluster" "billing_db" {
  cluster_identifier      = "billing-aurora-cluster"
  engine                  = "aurora-postgresql"
  availability_zones      = ["us-east-1a", "us-east-1b"]
  database_name           = "billing"
  master_username         = "admin"
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"
  multi_az                = true
  storage_encrypted       = true
}`
  }
];

export default function EngineeringChatPage() {
  const { pushToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!inputVal.trim() || isSending) return;

    const userText = inputVal.trim();
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsSending(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      pushToast({ title: "Thinking…", description: "The copilot is reviewing your architecture context.", type: "info" });
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      const copilotMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "copilot",
        text: data.reply || "I could not generate a response from the uploaded context.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (error) {
      pushToast({ title: "Unable to reply", description: "The backend did not respond. Please check the API server and try again.", type: "error" });
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 2),
          sender: "copilot",
          text: "I could not reach the backend. Make sure the API server is running and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestedClick = (prompt: string) => {
    setInputVal(prompt);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-3xl border border-zinc-850 bg-zinc-950/20 shadow-[0_12px_50px_rgba(0,0,0,0.2)]">
        
        {/* Chat Thread Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 border-r border-zinc-850 bg-zinc-950/40">
          <div className="p-4 border-b border-zinc-850">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-white transition-all">
              <Plus className="w-4 h-4" /> New Conversation
            </button>
          </div>
          <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            <div className="px-2 text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">
              Recent Chats
            </div>
            {mockThreads.map((thread) => (
              <button
                key={thread.id}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all truncate flex items-center justify-between group ${
                  thread.active
                    ? "bg-zinc-850/80 text-white"
                    : "text-zinc-400 hover:bg-zinc-900/45 hover:text-zinc-200"
                }`}
              >
                <span className="truncate">{thread.title}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </aside>

        {/* Chatting Box */}
        <div className="flex-1 flex flex-col justify-between h-full bg-[#09090b]/40">
          {/* Messages Stream */}
          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-3xl ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Profile Icon */}
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-semibold text-xs ${
                  msg.sender === "user"
                    ? "bg-zinc-700 text-white"
                    : "bg-white text-black"
                }`}>
                  {msg.sender === "user" ? "JD" : "AI"}
                </div>

                {/* Message Body */}
                <div className="space-y-3">
                  <div
                    className={`rounded-2xl border p-4 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-zinc-900 border-zinc-850 text-white"
                        : "bg-zinc-950/70 border-zinc-900 text-zinc-300"
                    }`}
                  >
                    {/* Render formatting helper for mock bold text */}
                    <div className="space-y-2">
                      {msg.text.split("\n").map((para, i) => (
                        <p key={i}>
                          {para.split("**").map((chunk, j) => {
                            if (j % 2 === 1) return <strong key={j} className="text-white font-semibold">{chunk}</strong>;
                            return chunk;
                          })}
                        </p>
                      ))}
                    </div>

                    {msg.nodesAffected && (
                      <div className="mt-3.5 pt-3 border-t border-zinc-900 flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] text-zinc-500 font-medium">Nodes Affected:</span>
                        {msg.nodesAffected.map((node) => (
                          <span
                            key={node}
                            className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-400"
                          >
                            {node}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.codeSnippet && (
                    <div className="rounded-lg border border-zinc-900 bg-zinc-950 overflow-hidden font-mono text-[11px] max-w-full">
                      <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between text-zinc-500 text-[10px]">
                        <span>terraform_patch.tf</span>
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Suggestion</span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-zinc-400 leading-relaxed">
                        <code>{msg.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions & Input Container */}
          <div className="space-y-4 border-t border-zinc-850 bg-[#09090b]/60 p-4">
            {/* Suggested prompts list */}
            {messages.length < 4 && (
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedClick(prompt)}
                    className="px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-850 text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isSending}
                placeholder="Ask Visual Systems Copilot about architecture, security configurations, or endpoints..."
                className="flex-1 rounded-2xl border border-zinc-850 bg-zinc-900 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 focus:outline-none disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={isSending}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition-all hover:bg-zinc-200 disabled:opacity-60"
              >
                {isSending ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Thinking...</> : <><Send className="h-3.5 w-3.5" /> Send</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
