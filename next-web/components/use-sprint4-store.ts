"use client";

import { useEffect, useState } from "react";
import { seedInterviewWorkspaces, seedSubscription, SPRINT4_STORE_KEY, type AgentRun, type InterviewWorkspace, type Subscription } from "@/lib/sprint4-data";

export type Sprint4Store = { interviews: InterviewWorkspace[]; agentRuns: AgentRun[]; subscription: Subscription; usage: { aiCalls: number; interviewSessions: number } };
const seed: Sprint4Store = { interviews: seedInterviewWorkspaces, agentRuns: [], subscription: seedSubscription, usage: { aiCalls: 2, interviewSessions: 1 } };
export function useSprint4Store() {
  const [store, setState] = useState(seed);
  useEffect(() => { try { const saved = localStorage.getItem(SPRINT4_STORE_KEY); if (saved) setState({ ...seed, ...JSON.parse(saved) }); } catch {} }, []);
  function setStore(next: Sprint4Store | ((current: Sprint4Store) => Sprint4Store)) { setState((current) => { const value = typeof next === "function" ? next(current) : next; localStorage.setItem(SPRINT4_STORE_KEY, JSON.stringify(value)); return value; }); }
  return { store, setStore };
}
