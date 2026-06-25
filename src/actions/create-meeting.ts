"use server"

import { eq } from "drizzle-orm"

import db from "@/db"
import { meetingDates, meetings } from "@/db/schema"
import { createMeetingInputSchema } from "@/lib/schemas/create-meeting"

function generateSlug() {
  return crypto.randomUUID()
}

function parseHour(value: string, fallback: number) {
  if (!value) {
    return fallback
  }

  const hour = Number.parseInt(value, 10)
  return Number.isNaN(hour) ? fallback : hour
}

export type CreateMeetingResult =
  | { success: true; slug: string }
  | { success: false; error: string }

export async function createMeeting(
  input: unknown
): Promise<CreateMeetingResult> {
  const parsed = createMeetingInputSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, error: "Invalid form data." }
  }

  const { eventName, description, fromTime, toTime, timezone, availableDates } =
    parsed.data

  try {
    const slug = generateSlug()

    const [meeting] = await db
      .insert(meetings)
      .values({
        slug,
        eventName,
        description: description.trim() || null,
        timezone,
        showFromHour: parseHour(fromTime, 0),
        showToHour: parseHour(toTime, 23),
      })
      .returning({ id: meetings.id, slug: meetings.slug })

    await db.insert(meetingDates).values(
      availableDates.map((date) => ({
        meetingId: meeting.id,
        date,
      }))
    )

    return { success: true, slug: meeting.slug }
  } catch (error) {
    console.error("Failed to create meeting:", error)
    return {
      success: false,
      error: "Failed to create event. Please try again.",
    }
  }
}

export async function getMeetingBySlug(slug: string) {
  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.slug, slug))
    .limit(1)

  if (!meeting) {
    return null
  }

  const dates = await db
    .select()
    .from(meetingDates)
    .where(eq(meetingDates.meetingId, meeting.id))

  return { meeting, dates }
}
