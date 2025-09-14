"use client";
// Timeline.js
import React from "react";

// Simple SVG Gantt chart per core
export default function Timeline({ timeline, cores }) {
  if (!timeline || timeline.length === 0) return null;
  // Find total time
  const endTime = Math.max(...timeline.map((e) => e.end));
  const rowHeight = 32;
  const colWidth = 32;
  return (
    <svg
      width={colWidth * endTime + 80}
      height={rowHeight * cores + 40}
      style={{ background: "#1f2937", border: "1px solid #374151" }}
    >
      {/* Core labels */}
      {[...Array(cores)].map((_, c) => (
        <text key={c} x={8} y={rowHeight * c + 28} fontSize={14} fill="#e5e7eb">
          Core {c}
        </text>
      ))}
      {/* Timeline blocks */}
      {timeline.map((e, i) => (
        <g key={i}>
          <rect
            x={60 + e.start * colWidth}
            y={rowHeight * e.coreId + 8}
            width={(e.end - e.start) * colWidth}
            height={rowHeight - 8}
            fill={e.threadId === "IDLE" ? "#374151" : "#3b82f6"}
            stroke="#4b5563"
            rx={6}
          />
          <text
            x={60 + (e.start + (e.end - e.start) / 2) * colWidth}
            y={rowHeight * e.coreId + 28}
            fontSize={14}
            fill={e.threadId === "IDLE" ? "#9ca3af" : "#ffffff"}
            textAnchor="middle"
          >
            {e.threadId}
          </text>
        </g>
      ))}
      {/* Time axis */}
      {[...Array(endTime + 1)].map((_, t) => (
        <text
          key={t}
          x={60 + t * colWidth}
          y={rowHeight * cores + 28}
          fontSize={12}
          fill="#e5e7eb"
        >
          {t}
        </text>
      ))}
    </svg>
  );
}
