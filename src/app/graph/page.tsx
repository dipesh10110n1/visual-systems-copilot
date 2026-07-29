"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Network, ZoomIn, ZoomOut, Maximize2, Settings, Info, Server, Cpu, Database, HelpCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface Node {
  id: string;
  label: string;
  type: "Gateway" | "Service" | "Database" | "Cache";
  status: "Healthy" | "Warning" | "Critical";
  x: number;
  y: number;
  connections: string[];
  details: {
    ip: string;
    tech: string;
    throughput: string;
    latency: string;
  };
}

const mockNodes: Node[] = [
  {
    id: "edge-gw",
    label: "Edge API Gateway",
    type: "Gateway",
    status: "Healthy",
    x: 80,
    y: 200,
    connections: ["auth-svc", "billing-svc"],
    details: { ip: "10.0.1.4", tech: "Kong / Nginx", throughput: "1.2k req/s", latency: "12ms" }
  },
  {
    id: "auth-svc",
    label: "Auth Verification Service",
    type: "Service",
    status: "Healthy",
    x: 320,
    y: 100,
    connections: ["user-db", "session-cache"],
    details: { ip: "10.0.2.14", tech: "Node.js (NestJS)", throughput: "450 req/s", latency: "24ms" }
  },
  {
    id: "billing-svc",
    label: "Billing Manager API",
    type: "Service",
    status: "Warning",
    x: 320,
    y: 300,
    connections: ["billing-db", "auth-svc"],
    details: { ip: "10.0.2.88", tech: "Go (Fiber)", throughput: "180 req/s", latency: "42ms" }
  },
  {
    id: "user-db",
    label: "User Profile DB (Postgres)",
    type: "Database",
    status: "Healthy",
    x: 580,
    y: 80,
    connections: [],
    details: { ip: "10.0.3.102", tech: "AWS Aurora PostgreSQL", throughput: "600 IOPS", latency: "4ms" }
  },
  {
    id: "session-cache",
    label: "Session Store (Redis)",
    type: "Cache",
    status: "Healthy",
    x: 580,
    y: 200,
    connections: [],
    details: { ip: "10.0.3.10", tech: "Redis Cluster", throughput: "1.4k req/s", latency: "1ms" }
  },
  {
    id: "billing-db",
    label: "Billing Aurora Cluster",
    type: "Database",
    status: "Critical",
    x: 580,
    y: 320,
    connections: [],
    details: { ip: "10.0.3.200", tech: "AWS Aurora Serverless v2", throughput: "950 IOPS", latency: "4ms" }
  }
];

export default function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(mockNodes[0]);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredNodes = mockNodes.filter((node) => {
    if (activeFilter === "All") return true;
    return node.type === activeFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full flex flex-col">
        {/* Header control options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Interactive System Topology</h1>
            <p className="text-zinc-400 text-sm">
              Visually navigate components, services, and databases parsed from your workspace.
            </p>
          </div>

          {/* Node Category Toggles */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
            {["All", "Gateway", "Service", "Database", "Cache"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  activeFilter === filter
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[500px]">
          {/* Node Graph Sandbox */}
          <div className="lg:col-span-3 border border-zinc-850 rounded-xl bg-zinc-950/20 relative overflow-hidden flex flex-col justify-center items-center min-h-[450px]">
            {/* Top Toolbar panel */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
              <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"><ZoomIn className="w-4 h-4" /></button>
              <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"><ZoomOut className="w-4 h-4" /></button>
              <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"><Maximize2 className="w-4 h-4" /></button>
              <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
              <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"><Settings className="w-4 h-4" /></button>
            </div>

            {/* Canvas grid lines */}
            <div className="absolute inset-0 dot-grid pointer-events-none opacity-20" />

            {/* SVG Link lines between nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="healthy-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="warning-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {mockNodes.map((node) =>
                node.connections.map((targetId) => {
                  const target = mockNodes.find((n) => n.id === targetId);
                  if (!target) return null;
                  
                  const isWarning = node.status === "Warning" || target.status === "Warning";
                  const strokeColor = isWarning ? "url(#warning-grad)" : "url(#healthy-grad)";

                  return (
                    <g key={`${node.id}-${target.id}`}>
                      {/* Animated path dash lines */}
                      <path
                        d={`M ${node.x + 80} ${node.y + 25} C ${(node.x + target.x) / 2 + 80} ${node.y + 25}, ${(node.x + target.x) / 2} ${target.y + 25}, ${target.x} ${target.y + 25}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        strokeDasharray="4, 4"
                        className="animate-[dash_10s_linear_infinite]"
                      />
                    </g>
                  );
                })
              )}
            </svg>

            {/* Nodes overlay container */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <motion.div
                    key={node.id}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ left: node.x, top: node.y }}
                    onClick={() => setSelectedNode(node)}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div
                      className={`w-44 p-3 rounded-lg border-2 bg-zinc-900 shadow-xl transition-all ${
                        isSelected
                          ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                          {node.type}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${
                          node.status === "Healthy"
                            ? "bg-emerald-500"
                            : node.status === "Warning"
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-rose-500 animate-pulse"
                        }`} />
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{node.label}</h4>
                      <p className="text-[9px] text-zinc-500 font-mono mt-1">{node.details.tech}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend guide */}
            <div className="absolute bottom-4 left-4 z-20 flex gap-4 text-[10px] text-zinc-500 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-900">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Warning</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical Risk</span>
            </div>
          </div>

          {/* Node Metadata Inspector Panel */}
          <div className="border border-zinc-850 rounded-xl bg-zinc-950/20 p-6 flex flex-col justify-between h-full min-h-[450px]">
            {selectedNode ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                      {selectedNode.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      selectedNode.status === "Healthy" ? "text-emerald-400" : selectedNode.status === "Warning" ? "text-yellow-400" : "text-rose-400"
                    }`}>
                      {selectedNode.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{selectedNode.label}</h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1">{selectedNode.details.ip}</p>
                </div>

                <div className="border-t border-zinc-900 pt-5 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Technology Core</span>
                    <span className="text-xs font-semibold text-white font-mono mt-1 block">{selectedNode.details.tech}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Load Throughput</span>
                    <span className="text-xs font-semibold text-white font-mono mt-1 block">{selectedNode.details.throughput}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Round-Trip Latency</span>
                    <span className="text-xs font-semibold text-white font-mono mt-1 block">{selectedNode.details.latency}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-5">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block mb-2">Connected Downstream</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connections.length > 0 ? (
                      selectedNode.connections.map((cId) => {
                        const target = mockNodes.find((n) => n.id === cId);
                        return (
                          <span
                            key={cId}
                            onClick={() => {
                              const node = mockNodes.find((n) => n.id === cId);
                              if (node) setSelectedNode(node);
                            }}
                            className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white cursor-pointer transition-all"
                          >
                            {target?.label || cId}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic">No downstream dependencies</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                <Info className="w-8 h-8 text-zinc-600" />
                <p className="text-xs text-zinc-400">Select a node from the topology diagram to inspect metadata details.</p>
              </div>
            )}

            <div className="border-t border-zinc-900 pt-4 mt-6">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/40 border border-zinc-850">
                <HelpCircle className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-[10px] text-zinc-500 leading-snug">
                  Connections represent system pathways mapped during visual ingestion.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
