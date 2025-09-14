"use client";
// ReadyQueue.js
import React from "react";

export default function ReadyQueue({ queue }) {
  return (
    <div className="text-gray-200">
      <h4 className="text-lg font-medium mb-2">Ready Queue</h4>
      <div className="flex gap-2">
        {queue.length === 0 ? (
          <span className="text-gray-400">Idle</span>
        ) : (
          queue.map((t) => (
            <span
              key={t.threadId}
              className="border border-gray-600 bg-gray-700 px-2 py-1 rounded"
            >
              {t.threadId}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
