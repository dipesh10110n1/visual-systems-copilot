"use client";
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function SystemGraph({ data }: { data: any }) {
  const nodes = data.components.map((c: any, i: number) => ({
    id: c.id,
    data: { label: `${c.name}\n(${c.type})` },
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    style: { background: '#1e1e2e', color: '#fff', border: '1px solid #6366f1', borderRadius: '8px' }
  }));

  const edges = data.relationships.map((r: any, i: number) => ({
    id: `e${i}`, source: r.source, target: r.target, label: r.relation, animated: true
  }));

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-white/10">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#222" />
        <Controls />
      </ReactFlow>
    </div>
  );
}