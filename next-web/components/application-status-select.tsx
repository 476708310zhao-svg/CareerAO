"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
const statuses = ["Interested", "Preparing", "Applied", "OA", "Recruiter Screen", "Interview", "Final", "Offer", "Rejected"];
export function ApplicationStatusSelect({ applicationId, initialStatus }: { applicationId: string; initialStatus: string }) { const [status, setStatus] = useState(initialStatus); return <select className="application-status-select" value={status} onChange={(event) => { const previous = status; setStatus(event.target.value); track("application_status_change", { application_id: applicationId, previous_status: previous, next_status: event.target.value }); }}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>; }
