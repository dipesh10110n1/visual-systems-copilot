"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Server, Layers, ShieldAlert, Sparkles, Database, ArrowRight, ShieldCheck, Cpu, Copy, Download } from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

type AnalysisData = {
  Summary?: string;
  Components?: Array<{ name?: string; type?: string; detail?: string }>;
  Relationships?: Array<{ source?: string; target?: string; detail?: string }>;
  Risks?: Array<{ severity?: string; title?: string; description?: string }>;
  Recommendations?: Array<{ title?: string; description?: string }>;
};

const fallbackAnalysis: AnalysisData = {
  Summary: "The uploaded engineering assets describe a modular platform with ingress, service, and data layers that support distributed operations and maintainability.",
  Components: [
    { name: "Edge Gateway", type: "Gateway", detail: "Handles external traffic and routes requests." },
    { name: "Identity Service", type: "Microservice", detail: "Manages authentication and access control." },
    { name: "Analytics Store", type: "Database", detail: "Stores operational and audit data." },
  ],
  Relationships: [
    { source: "Edge Gateway", target: "Identity Service", detail: "Routes auth requests" },
    { source: "Identity Service", target: "Analytics Store", detail: "Logs access events" },
  ],
  Risks: [
    { severity: "High", title: "Unencrypted service traffic", description: "Some internal links still rely on non-TLS channels." },
  ],
  Recommendations: [
    { title: "Enforce TLS", description: "Secure internal service traffic with mutual TLS." },
  ],
};

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<string>("arch-summary");
  const [copyState, setCopyState] = useState<string>("Copy");

  const analysis = fallbackAnalysis;

  const markdown = useMemo(() => {
    const lines: string[] = [];
    lines.push("# System Documentation");
    lines.push("");
    lines.push("## Architecture Summary");
    lines.push(analysis.Summary || "No summary available.");
    lines.push("");
    lines.push("## Components");
    (analysis.Components || []).forEach((component) => {
      lines.push(`- **${component.name || "Unnamed Component"}** (${component.type || "Component"}): ${component.detail || "No details provided."}`);
    });
    lines.push("");
    lines.push("## Dependencies");
    (analysis.Relationships || []).forEach((relationship) => {
      lines.push(`- ${relationship.source || "Source"} → ${relationship.target || "Target"}: ${relationship.detail || "No detail provided."}`);
    });
    lines.push("");
    lines.push("## Risk Analysis");
    (analysis.Risks || []).forEach((risk) => {
      lines.push(`- **${risk.severity || "Unknown"}**: ${risk.title || "Untitled risk"} — ${risk.description || "No description provided."}`);
    });
    lines.push("");
    lines.push("## Recommendations");
    (analysis.Recommendations || []).forEach((recommendation) => {
      lines.push(`- **${recommendation.title || "Recommendation"}**: ${recommendation.description || "No description provided."}`);
    });
    return lines.join("\n");
  }, [analysis]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy"), 1400);
    } catch {
      setCopyState("Copy failed");
      window.setTimeout(() => setCopyState("Copy"), 1400);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "system-documentation.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const docSections: DocSection[] = [
    {
      id: "arch-summary",
      title: "Architecture Summary",
      icon: Server,
      content: (
        <div className="space-y-6">
          <p className="text-sm text-zinc-400 leading-relaxed">{analysis.Summary}</p>
          <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-850">
            <h4 className="text-xs font-semibold text-white mb-3">Highlights</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400" /> <span>Distributed ingress and service routing are central to the design.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400" /> <span>Core services rely on a shared data layer for observability and audit needs.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400" /> <span>Security hardening remains the main improvement opportunity.</span></li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "components",
      title: "Components",
      icon: Cpu,
      content: (
        <div className="space-y-4">
          {(analysis.Components || []).map((component, index) => (
            <div key={`${component.name || index}`} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">{component.name || `Component ${index + 1}`}</h4>
                <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">{component.type || "Component"}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{component.detail || "No details provided."}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "dependencies",
      title: "Dependencies",
      icon: Layers,
      content: (
        <div className="space-y-4">
          {(analysis.Relationships || []).map((relationship, index) => (
            <div key={`${relationship.source || index}-${relationship.target || index}`} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-sm font-semibold text-white">{relationship.source || "Source"} → {relationship.target || "Target"}</p>
              <p className="mt-2 text-sm text-zinc-400">{relationship.detail || "No detail provided."}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "risk-analysis",
      title: "Risk Analysis",
      icon: ShieldAlert,
      content: (
        <div className="space-y-4">
          {(analysis.Risks || []).map((risk, index) => (
            <div key={`${risk.title || index}`} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">{risk.title || "Risk"}</h4>
                <span className="rounded-full bg-rose-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400">{risk.severity || "Unknown"}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{risk.description || "No description provided."}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "recommendations",
      title: "Recommendations",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          {(analysis.Recommendations || []).map((recommendation, index) => (
            <div key={`${recommendation.title || index}`} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">{recommendation.title || "Recommendation"}</h4>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{recommendation.description || "No description provided."}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const activeDoc = docSections.find((sec) => sec.id === activeSection) || docSections[0];
  const ActiveIcon = activeDoc.icon;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="space-y-1.5 lg:col-span-1">
          <div className="mb-3 flex items-center gap-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <BookOpen className="h-3.5 w-3.5" /> Documentation
          </div>
          <div className="space-y-1">
            {docSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all ${
                    activeSection === sec.id ? "border-l-2 border-white bg-zinc-850 pl-3.5 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{sec.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="max-w-3xl space-y-6 lg:col-span-3">
          <div className="flex flex-col gap-4 border-b border-zinc-900 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
                <span>System Report</span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-zinc-400">{activeDoc.title}</span>
              </div>
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                <ActiveIcon className="h-5 w-5 text-indigo-400" /> {activeDoc.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white">
                <Copy className="h-4 w-4" /> {copyState}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white">
                <Download className="h-4 w-4" /> Markdown
              </button>
            </div>
          </div>

          <div className="min-h-[300px]">{activeDoc.content}</div>
        </main>
      </div>
    </DashboardLayout>
  );
}
