"use server"

import { eq } from "drizzle-orm"

import db from "@/db"
import { responses } from "@/db/schema"

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

  try {
    await db
      .insert(responses)
      .values({
        meetingId,
        name: trimmed,
        timeSlots,
      })
      .onConflictDoUpdate({
        target: [responses.meetingId, responses.name],
        set: { timeSlots },
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
