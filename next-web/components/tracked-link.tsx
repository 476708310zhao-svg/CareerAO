"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = LinkProps & {
  children: ReactNode;
  className?: string;
  event: AnalyticsEvent;
  properties?: Record<string, unknown>;
};

export function TrackedLink({ event, properties, children, ...props }: Props) {
  return <Link {...props} onClick={() => track(event, properties)}>{children}</Link>;
}
