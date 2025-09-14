"use client";
// Thread Scheduling Simulator Main Page
import dynamic from "next/dynamic";
import { useSchedulerStore } from "../store";
import ThreadForm from "../components/ThreadForm";
import AlgorithmSelector from "../components/AlgorithmSelector";
import Timeline from "../components/Timeline";
import ReadyQueue from "../components/ReadyQueue";
import MetricsTable from "../components/MetricsTable";
import { simulateSJF, simulateSRTF } from "../../lib/scheduler";

export default function Home() {
  const {
    algorithm,
    setAlgorithm,
    numCores,
    setNumCores,
    numThreads,
    setNumThreads,
    threads,
    setThreads,
    timeline,
    setTimeline,
    metrics,
    setMetrics,
    readyQueue,
    setReadyQueue,
    reset,
  } = useSchedulerStore();

  const handleSimulate = () => {
    const validThreads = threads
      .filter((t) => t.threadId && t.burstTime > 0 && t.arrivalTime >= 0)
      .map((t) => ({
        ...t,
        burstTime: Number(t.burstTime),
        arrivalTime: Number(t.arrivalTime),
      }));
    let result;
    if (algorithm === "SJF") {
      result = simulateSJF(validThreads, numCores);
    } else {
      result = simulateSRTF(validThreads, numCores);
    }
    setTimeline(result.timeline);
    setMetrics(result.metrics);
    // For demo: readyQueue is empty after simulation
    setReadyQueue([]);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center tracking-tight drop-shadow">
          Thread Scheduling Simulator
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Controls */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 flex flex-col gap-4">
              <AlgorithmSelector
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
              />
              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-200">
                  Number of CPU Cores:
                </label>
                <input
                  type="number"
                  min={1}
                  value={numCores}
                  onChange={(e) =>
                    setNumCores(Math.max(1, Number(e.target.value)))
                  }
                  className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 w-20 focus:outline-blue-400"
                />
              </div>
            </div>
            <ThreadForm
              threads={threads}
              setThreads={setThreads}
              numThreads={numThreads}
              setNumThreads={setNumThreads}
            />
            <div className="flex gap-3 mt-2">
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                onClick={handleSimulate}
              >
                Start Simulation
              </button>
              <button
                className="bg-gray-700 text-gray-200 px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-600 transition"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
          {/* Right: Visualization */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 flex flex-col gap-4">
              <ReadyQueue queue={readyQueue} />
              <div className="overflow-x-auto">
                <Timeline timeline={timeline} cores={numCores} />
              </div>
            </div>
            <MetricsTable metrics={metrics} />
          </div>
        </div>
      </div>
    </div>
  );
}
