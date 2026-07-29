"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowUpRight,
  AlertTriangle,
  Code2,
  Cpu,
  Lightbulb,
  Lock,
  Server,
  Terminal,
  Workflow,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const gemmaOutput = {
    summary:
      "A distributed enterprise platform with edge gateways, internal services, and a secure data layer. The architecture prioritizes availability, traceability, and controlled access across cloud regions.",
    components: [
      { name: "Edge Gateway", type: "Gateway", detail: "Ingress layer for API and traffic routing." },
      { name: "Identity Service", type: "Service", detail: "Handles authentication and token issuance." },
      { name: "Billing Engine", type: "Service", detail: "Processes invoicing and subscription events." },
      { name: "Analytics Store", type: "Database", detail: "Stores telemetry and operational metrics." },
    ],
    dependencies: [
      { source: "Edge Gateway", target: "Identity Service", detail: "OAuth handoff and policy checks." },
      { source: "Billing Engine", target: "Analytics Store", detail: "Writes billing events and usage metrics." },
      { source: "Identity Service", target: "Analytics Store", detail: "Audits access decisions and sign-ins." },
    ],
    risks: [
      { severity: "High", title: "Unencrypted service traffic", description: "Some internal links still rely on non-TLS channels for legacy integrations." },
      { severity: "Medium", title: "Single point of failure", description: "The billing service has limited redundancy for peak traffic bursts." },
      { severity: "Low", title: "Observability gaps", description: "A few critical dependencies lack full tracing coverage." },
    ],
    recommendations: [
      { title: "Enforce mutual TLS", description: "Secure service-to-service communication across all internal routes." },
      { title: "Introduce autoscaling", description: "Scale billing and identity services during demand spikes." },
      { title: "Add deeper tracing", description: "Instrument dependencies with distributed tracing and alerting." },
    ],
  };

  const statCards = [
    {
      title: "System Summary",
      value: "Distributed Platform",
      subtitle: "Multi-region deployment with resilient edge traffic handling",
      icon: Server,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      title: "Components",
      value: "4 Core Nodes",
      subtitle: "Gateway, services, and data layer identified",
      icon: Cpu,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Dependencies",
      value: "3 Active Links",
      subtitle: "Validated service interactions and data pathways",
      icon: Workflow,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      title: "Risk Signals",
      value: "3 Findings",
      subtitle: "Security and reliability issues surfaced",
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Gemma Analysis Dashboard</h1>
            <p className="text-zinc-400 text-sm">
              Structured review output with polished cards for the uploaded system assets.
            </p>
          </div>
          <Link href="/graph">
            <span className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer">
              View Knowledge Graph <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`p-5 rounded-2xl border bg-zinc-950/45 ${card.border} shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">{card.title}</span>
                  <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-white">{card.value}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{card.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950/90 via-zinc-900/70 to-zinc-950/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">System Summary</h2>
          </div>
          <p className="text-lg text-zinc-200 leading-8">{gemmaOutput.summary}</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Components</h3>
            </div>
            <div className="space-y-3">
              {gemmaOutput.components.map((component) => (
                <div key={component.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{component.name}</p>
                      <p className="text-xs text-zinc-500">{component.type}</p>
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                      Active
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{component.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Dependencies</h3>
            </div>
            <div className="space-y-3">
              {gemmaOutput.dependencies.map((dependency) => (
                <div key={`${dependency.source}-${dependency.target}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <p className="text-sm font-semibold text-white">{dependency.source} → {dependency.target}</p>
                  <p className="mt-2 text-sm text-zinc-400">{dependency.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-white">Risk Analysis</h3>
            </div>
            <div className="space-y-3">
              {gemmaOutput.risks.map((risk) => (
                <div key={risk.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{risk.title}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      risk.severity === "High"
                        ? "bg-rose-500/10 text-rose-400"
                        : risk.severity === "Medium"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-sky-500/10 text-sky-400"
                    }`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{risk.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-semibold text-white">Recommendations</h3>
            </div>
            <div className="space-y-3">
              {gemmaOutput.recommendations.map((recommendation) => (
                <div key={recommendation.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <p className="text-sm font-semibold text-white">{recommendation.title}</p>
                  </div>
                  <p className="text-sm text-zinc-400">{recommendation.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
