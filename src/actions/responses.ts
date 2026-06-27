"use server"

import { eq } from "drizzle-orm"

import db from "@/db"
import { meetingDates, meetings, responses } from "@/db/schema"

export type SaveResponseResult =
  | { success: true }
  | { success: false; error: string }

export async function saveResponse(
  meetingId: string,
  name: string,
  timeSlots: string[]
): Promise<SaveResponseResult> {
  const trimmed = name.trim()

  if (!trimmed) {
    return { success: false, error: "Name is required." }
  }

  if (
    !Array.isArray(timeSlots) ||
    timeSlots.length === 0 ||
    !timeSlots.every((s) => typeof s === "string" && s.length > 0)
  ) {
    return { success: false, error: "At least one valid time slot is required." }
  }

  const [meeting] = await db
    .select({ showFromHour: meetings.showFromHour, showToHour: meetings.showToHour })
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1)

  if (!meeting) {
    return { success: false, error: "Meeting not found." }
  }

  const dates = await db
    .select({ date: meetingDates.date })
    .from(meetingDates)
    .where(eq(meetingDates.meetingId, meetingId))

  const validKeys = new Set<string>()
  for (const d of dates) {
    for (let h = meeting.showFromHour; h <= meeting.showToHour; h++) {
      validKeys.add(`${d.date}T${String(h).padStart(2, "0")}:00`)
      if (h < meeting.showToHour) {
        validKeys.add(`${d.date}T${String(h).padStart(2, "0")}:30`)
      }
    }
  }

  const valid = timeSlots.filter((s) => validKeys.has(s))
  if (valid.length === 0) {
    return { success: false, error: "No valid time slots provided." }
  }

  try {
    await db
      .insert(responses)
      .values({
        meetingId,
        name: trimmed,
        timeSlots: valid,
      })
      .onConflictDoUpdate({
        target: [responses.meetingId, responses.name],
        set: { timeSlots: valid },
      })

    return { success: true }
  } catch (error) {
    console.error("Failed to save response:", error)
    return { success: false, error: "Failed to save. Please try again." }
  }
}

export async function getResponses(meetingId: string) {
  const rows = await db
    .select()
    .from(responses)
    .where(eq(responses.meetingId, meetingId))
    .orderBy(responses.createdAt)

  return rows
}
