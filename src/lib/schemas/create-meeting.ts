import * as z from "zod"

export const createMeetingFormSchema = z.object({
  eventName: z.string().trim().min(1, "Event name is required."),
  description: z.string(),
  fromTime: z.string().min(1, "Start time is required."),
  toTime: z.string().min(1, "End time is required."),
  timezone: z.string(),
  availableDates: z
    .array(z.date())
    .min(1, "Select at least one available date."),
})

export const createMeetingInputSchema = createMeetingFormSchema.extend({
  availableDates: z
    .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .min(1, "Select at least one available date."),
})

export type CreateMeetingFormValues = z.infer<typeof createMeetingFormSchema>
export type CreateMeetingInput = z.infer<typeof createMeetingInputSchema>
