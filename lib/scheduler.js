
function threadCompare(a, b, key = "burstTime") {
  if (a[key] !== b[key]) return a[key] - b[key];
  if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
  return a.threadId.localeCompare(b.threadId);
}

/**
 * Non-preemptive SJF (Shortest Job First)
 * @param {Thread[]} threads
 * @param {number} cores
 * @returns {{ timeline: TimelineEntry[], metrics: ThreadMetric[] }}
 */
export function simulateSJF(threads, cores) {
  const jobs = threads.map((t) => ({
    ...t,
    remaining: t.burstTime,
    started: false,
    finished: false,
  }));
  const timeline = [];
  const metrics = [];
  const n = jobs.length;
  let time = 0;
  let completed = 0;
  const coreStates = Array(cores).fill(null); 
  const readyQueue = [];
  const firstResponse = {};

  while (completed < n) {
    jobs.forEach((j) => {
      if (
        !j.finished &&
        !j.started &&
        j.arrivalTime <= time &&
        !readyQueue.includes(j)
      ) {
        readyQueue.push(j);
      }
    });
    readyQueue.sort((a, b) => threadCompare(a, b, "burstTime"));

   
    for (let c = 0; c < cores; c++) {
      if (!coreStates[c] || coreStates[c].endTime <= time) {
        
        if (coreStates[c] && coreStates[c].thread) {
          const t = coreStates[c].thread;
          t.finished = true;
          completed++;
        }
       
        const next = readyQueue.shift();
        if (next) {
          next.started = true;
          if (!(next.threadId in firstResponse)) {
            firstResponse[next.threadId] = time;
          }
          timeline.push({
            coreId: c,
            threadId: next.threadId,
            start: time,
            end: time + next.burstTime,
          });
          coreStates[c] = { thread: next, endTime: time + next.burstTime };
        } else {
      
          if (
            !coreStates[c] ||
            coreStates[c].threadId !== "IDLE" ||
            coreStates[c].endTime <= time
          ) {
            timeline.push({
              coreId: c,
              threadId: "IDLE",
              start: time,
              end: time + 1,
            });
            coreStates[c] = { thread: { threadId: "IDLE" }, endTime: time + 1 };
          }
        }
      }
    }
    
    let nextTimes = [];
    for (let c = 0; c < cores; c++) {
      if (coreStates[c] && coreStates[c].endTime > time)
        nextTimes.push(coreStates[c].endTime);
    }
    const nextArrivals = jobs
      .filter((j) => !j.started && !j.finished && j.arrivalTime > time)
      .map((j) => j.arrivalTime);
    nextTimes = nextTimes.concat(nextArrivals);
    if (nextTimes.length === 0) break;
    time = Math.min(...nextTimes);
  }

  
  jobs.forEach((j) => {
    if (j.threadId === "IDLE") return;
    const tTimeline = timeline.filter((e) => e.threadId === j.threadId);
    const start = tTimeline[0]?.start ?? 0;
    const end = tTimeline[tTimeline.length - 1]?.end ?? 0;
    const completionTime = end;
    const turnaroundTime = completionTime - j.arrivalTime;
    const waitingTime = turnaroundTime - j.burstTime;
    const responseTime = (firstResponse[j.threadId] ?? start) - j.arrivalTime;
    metrics.push({
      threadId: j.threadId,
      arrivalTime: j.arrivalTime,
      burstTime: j.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });
  });
  return { timeline, metrics };
}

/**
 * Preemptive SJF (Shortest Remaining Time First, SRTF)
 * @param {Thread[]} threads
 * @param {number} cores
 * @returns {{ timeline: TimelineEntry[], metrics: ThreadMetric[] }}
 */
export function simulateSRTF(threads, cores) {
  
  const getConsolidatedTimeline = (entries) => {
    const consolidated = [];
    let current = null;

    for (const entry of entries) {
      if (!current) {
        current = { ...entry };
        continue;
      }
      if (
        current.threadId === entry.threadId &&
        current.coreId === entry.coreId &&
        current.end === entry.start
      ) {
        current.end = entry.end;
      } else {
        consolidated.push(current);
        current = { ...entry };
      }
    }
    if (current) {
      consolidated.push(current);
    }
    return consolidated;
  };


  const jobs = threads.map((t) => ({
    ...t,
    remaining: t.burstTime,
    started: false,
    finished: false,
  }));
  let timeline = [];
  const metrics = [];
  const n = jobs.length;
  let time = 0;
  let completed = 0;
  const coreStates = Array(cores).fill(null); 
  const readyQueue = [];
  const threadMap = Object.fromEntries(jobs.map((j) => [j.threadId, j]));
  const firstResponse = {};

  while (completed < n) {
    
    jobs.forEach((j) => {
      if (
        !j.finished &&
        j.arrivalTime <= time &&
        !readyQueue.includes(j) &&
        !coreStates.some(
          (cs) => cs && cs.thread && cs.thread.threadId === j.threadId
        )
      ) {
        readyQueue.push(j);
      }
    });
    
    readyQueue.sort((a, b) => threadCompare(a, b, "remaining"));

    
    for (let c = 0; c < cores; c++) {
      let running = coreStates[c]?.thread;
      // If running thread finished
      if (running && running.remaining === 0 && !running.finished) {
        running.finished = true;
        completed++;
        running = null;
        coreStates[c] = null;
      }
      
      let candidate = running && !running.finished ? running : null;
      if (readyQueue.length > 0) {
        const best = readyQueue[0];
        if (!candidate || best.remaining < candidate.remaining) {
       
          if (candidate && !candidate.finished) {
            readyQueue.push(candidate);
            readyQueue.sort((a, b) => threadCompare(a, b, "remaining"));
          }
          candidate = best;
          readyQueue.shift();
          if (!(candidate.threadId in firstResponse)) {
            firstResponse[candidate.threadId] = time;
          }
        }
      }
      
      if (candidate && !candidate.finished && candidate.remaining > 0) {
        candidate.started = true;
        candidate.remaining--;
        timeline.push({
          coreId: c,
          threadId: candidate.threadId,
          start: time,
          end: time + 1,
        });
        coreStates[c] = { thread: candidate };

        if (!(candidate.threadId in firstResponse)) {
          firstResponse[candidate.threadId] = time;
        }

       
        if (candidate.remaining === 0) {
          candidate.finished = true;
          completed++;
        }
      } else {
      
        timeline.push({
          coreId: c,
          threadId: "IDLE",
          start: time,
          end: time + 1,
        });
        coreStates[c] = null;
      }
    }
    time++;
  }


  timeline = getConsolidatedTimeline(timeline);

  jobs.forEach((j) => {
    if (j.threadId === "IDLE") return;
    const tTimeline = timeline.filter((e) => e.threadId === j.threadId);
    if (tTimeline.length === 0) return; 

    const end = tTimeline[tTimeline.length - 1].end;
    const completionTime = end;
    const turnaroundTime = completionTime - j.arrivalTime;
    const waitingTime = turnaroundTime - j.burstTime;
    const responseTime = firstResponse[j.threadId] - j.arrivalTime;

    metrics.push({
      threadId: j.threadId,
      arrivalTime: j.arrivalTime,
      burstTime: j.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });
  });
  return { timeline, metrics };
}
