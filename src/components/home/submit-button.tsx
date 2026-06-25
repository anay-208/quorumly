"use client"

import { Button } from "@/components/ui/button"
import type { CreateMeetingForm } from "@/components/home/use-create-meeting-form"

type SubmitButtonProps = {
  form: CreateMeetingForm
  submitError: string | null
}

export function SubmitButton({ form, submitError }: SubmitButtonProps) {
  return (
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ isSubmitting }) => (
        <div className="space-y-2">
          {submitError ? (
            <p className="text-xs text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}
          <Button
            className="mt-2"
            size="lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </div>
      )}
    </form.Subscribe>
  )
}
