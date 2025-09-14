"use client";
// MetricsTable.js
import React from "react";

export default function MetricsTable({ metrics }) {
  if (!metrics || metrics.length === 0) return null;
  const avg = (key) =>
    (metrics.reduce((a, b) => a + b[key], 0) / metrics.length).toFixed(2);
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
      <h4 className="text-lg font-medium text-gray-200 mb-4">Metrics</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-2 text-left text-gray-300">Thread ID</th>
              <th className="px-4 py-2 text-left text-gray-300">Arrival</th>
              <th className="px-4 py-2 text-left text-gray-300">Burst</th>
              <th className="px-4 py-2 text-left text-gray-300">Completion</th>
              <th className="px-4 py-2 text-left text-gray-300">Turnaround</th>
              <th className="px-4 py-2 text-left text-gray-300">Waiting</th>
              <th className="px-4 py-2 text-left text-gray-300">Response</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.threadId} className="border-b border-gray-700">
                <td className="px-4 py-2 text-gray-200">{m.threadId}</td>
                <td className="px-4 py-2 text-gray-200">{m.arrivalTime}</td>
                <td className="px-4 py-2 text-gray-200">{m.burstTime}</td>
                <td className="px-4 py-2 text-gray-200">{m.completionTime}</td>
                <td className="px-4 py-2 text-gray-200">{m.turnaroundTime}</td>
                <td className="px-4 py-2 text-gray-200">{m.waitingTime}</td>
                <td className="px-4 py-2 text-gray-200">{m.responseTime}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-700 font-medium">
              <td className="px-4 py-2 text-gray-300">Average</td>
              <td colSpan={3}></td>
              <td className="px-4 py-2 text-gray-200">
                {avg("turnaroundTime")}
              </td>
              <td className="px-4 py-2 text-gray-200">{avg("waitingTime")}</td>
              <td className="px-4 py-2 text-gray-200">{avg("responseTime")}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
