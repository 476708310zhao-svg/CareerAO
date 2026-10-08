"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") track("homepage_view");
    if (pathname.startsWith("/jobs/")) track("job_view", { job_id: pathname.split("/").pop() });
  }, [pathname]);

  return <Analytics />;
}
