"use client";

import { Button } from "@/components/ui/button";
import { assignCoach } from "./actions";

type Coach = { id: string; email: string | null; fullName: string | null };

export function AssignCoachForm({
  submissionId,
  coaches,
}: {
  submissionId: string;
  coaches: Coach[];
}) {
  return (
    <form
      action={assignCoach.bind(null, submissionId)}
      className="inline flex items-center gap-2"
    >
      <label htmlFor={`coach-${submissionId}`} className="sr-only">
        Assign coach
      </label>
      <select
        id={`coach-${submissionId}`}
        name="coachId"
        required
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
      >
        <option value="">Select coach</option>
        {coaches.map((c) => (
          <option key={c.id} value={c.id}>
            {c.fullName || c.email || c.id}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm">
        Assign
      </Button>
    </form>
  );
}
