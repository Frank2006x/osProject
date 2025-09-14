"use client";
import React, { useState } from "react";

export default function ThreadForm({
  threads,
  setThreads,
  numThreads,
  setNumThreads,
}) {
  const [localThreads, setLocalThreads] = useState(threads || []);

  const handleThreadChange = (idx, field, value) => {
    const updated = localThreads.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    );
    setLocalThreads(updated);
    setThreads(updated);
  };

  const handleNumThreads = (e) => {
    const n = Math.max(1, Number(e.target.value));
    setNumThreads(n);
    let arr = localThreads.slice(0, n);
    while (arr.length < n) {
      arr.push({
        threadId: `T${arr.length + 1}`,
        arrivalTime: 0,
        burstTime: 1,
      });
    }
    setLocalThreads(arr);
    setThreads(arr);
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800 mb-2">
      <div className="flex items-center gap-3 mb-4">
        <label className="font-medium text-white">Number of Threads:</label>
        <input
          type="number"
          min={1}
          value={numThreads}
          onChange={handleNumThreads}
          className="border border-gray-700 rounded px-2 py-1 w-20 focus:outline-blue-400 bg-gray-800 text-white placeholder-gray-400"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-3 py-2 border-b border-gray-700 font-semibold">
                Thread ID
              </th>
              <th className="px-3 py-2 border-b border-gray-700 font-semibold">
                Arrival Time
              </th>
              <th className="px-3 py-2 border-b border-gray-700 font-semibold">
                Burst Time
              </th>
            </tr>
          </thead>
          <tbody>
            {localThreads.map((t, i) => (
              <tr key={i} className="even:bg-gray-800">
                <td className="px-2 py-1 border-b border-gray-800">
                  <input
                    value={t.threadId}
                    onChange={(e) =>
                      handleThreadChange(i, "threadId", e.target.value)
                    }
                    className="border border-gray-700 rounded px-2 py-1 w-20 focus:outline-blue-400 bg-gray-900 text-white placeholder-gray-400"
                  />
                </td>
                <td className="px-2 py-1 border-b border-gray-800">
                  <input
                    type="number"
                    min={0}
                    value={t.arrivalTime}
                    onChange={(e) =>
                      handleThreadChange(
                        i,
                        "arrivalTime",
                        Number(e.target.value)
                      )
                    }
                    className="border border-gray-700 rounded px-2 py-1 w-20 focus:outline-blue-400 bg-gray-900 text-white placeholder-gray-400"
                  />
                </td>
                <td className="px-2 py-1 border-b border-gray-800">
                  <input
                    type="number"
                    min={1}
                    value={t.burstTime}
                    onChange={(e) =>
                      handleThreadChange(i, "burstTime", Number(e.target.value))
                    }
                    className="border border-gray-700 rounded px-2 py-1 w-20 focus:outline-blue-400 bg-gray-900 text-white placeholder-gray-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
