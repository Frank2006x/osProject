"use client";
// Zustand store for Thread Scheduling Simulator
import { create } from "zustand";

const defaultThreads = [
  { threadId: "T1", arrivalTime: 0, burstTime: 4 },
  { threadId: "T2", arrivalTime: 1, burstTime: 3 },
];

export const useSchedulerStore = create((set) => ({
  algorithm: "SJF",
  setAlgorithm: (algorithm) => set({ algorithm }),
  numCores: 2,
  setNumCores: (numCores) => set({ numCores }),
  numThreads: defaultThreads.length,
  setNumThreads: (numThreads) => set({ numThreads }),
  threads: defaultThreads,
  setThreads: (threads) => set({ threads }),
  timeline: [],
  setTimeline: (timeline) => set({ timeline }),
  metrics: [],
  setMetrics: (metrics) => set({ metrics }),
  readyQueue: [],
  setReadyQueue: (readyQueue) => set({ readyQueue }),
  reset: () =>
    set({
      algorithm: "SJF",
      numCores: 2,
      numThreads: defaultThreads.length,
      threads: defaultThreads,
      timeline: [],
      metrics: [],
      readyQueue: [],
    }),
}));
