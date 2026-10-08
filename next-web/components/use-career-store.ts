"use client";

import { useEffect, useState } from "react";
import { CAREER_STORE_KEY, seedStore, type CareerStore } from "@/lib/career-data";

export function useCareerStore() {
  const [store, setStoreState] = useState<CareerStore>(seedStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CAREER_STORE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CareerStore>;
        setStoreState({ ...seedStore, ...parsed, tasks: parsed.tasks || seedStore.tasks, reminderSettings: { ...seedStore.reminderSettings, ...(parsed.reminderSettings || {}) } });
      }
    } catch { /* keep safe seed state */ }
    setReady(true);
  }, []);

  function setStore(next: CareerStore | ((current: CareerStore) => CareerStore)) {
    setStoreState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      localStorage.setItem(CAREER_STORE_KEY, JSON.stringify(value));
      return value;
    });
  }

  return { store, setStore, ready };
}
