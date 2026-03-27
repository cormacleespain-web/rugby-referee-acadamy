"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitReport } from "../actions";
import { SubmitButton } from "@/components/ui/submit-button";

export function ReportForm({ submissionId }: { submissionId: string }) {
  const [state, formAction] = useActionState(
    (_prev: { error?: string; success?: boolean } | null, formData: FormData) =>
      submitReport(submissionId, formData),
    null as { error?: string; success?: boolean } | null
  );

  if (state?.success) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="font-medium text-primary">Report submitted successfully.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            The referee will be notified and can view the report in their dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your report</CardTitle>
        <p className="text-muted-foreground text-sm">
          Provide feedback and performance insights for the referee.
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm" role="alert">
              {state.error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback *</Label>
            <Textarea
              id="feedback"
              name="feedback"
              rows={8}
              required
              className="resize-none"
              placeholder="Detailed feedback on the referee's performance..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="performanceInsights">Performance insights</Label>
            <Textarea
              id="performanceInsights"
              name="performanceInsights"
              rows={4}
              className="resize-none"
              placeholder="Key takeaways and development suggestions..."
            />
          </div>
          <SubmitButton type="submit" pendingText="Submitting report...">
            Submit report
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
