"use client";
// AlgorithmSelector.js
import React from "react";

export default function AlgorithmSelector({ algorithm, setAlgorithm }) {
  return (
    <div className="flex items-center gap-3">
      <label className="font-medium text-gray-200">
        Scheduling Algorithm:{" "}
      </label>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-blue-400"
      >
        <option value="SJF">Non-Preemptive SJF</option>
        <option value="SRTF">Preemptive SJF (SRTF)</option>
      </select>
    </div>
  );
}
