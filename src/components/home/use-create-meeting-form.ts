"use client"

import { useForm } from "@tanstack/react-form"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { createMeeting } from "@/actions/create-meeting"
import { getDefaultTimezone } from "@/lib/utils/timezone"
import { createMeetingFormSchema } from "@/lib/schemas/create-meeting"

export function useCreateMeetingForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      eventName: "",
      description: "",
      fromTime: "",
      toTime: "",
      timezone: getDefaultTimezone(),
      availableDates: [] as Date[],
    },
    validators: {
      onSubmit: createMeetingFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      const result = await createMeeting({
        ...value,
        availableDates: value.availableDates.map((date) =>
          format(date, "yyyy-MM-dd")
        ),
      })

      if (!result.success) {
        setSubmitError(result.error)
        return
      }

      router.push(`/m/${result.slug}`)
    },
  })

  return { form, submitError }
}

export type CreateMeetingForm = ReturnType<typeof useCreateMeetingForm>["form"]
