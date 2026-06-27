import {
  integer,
  date,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

export const meetings = pgTable("meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  eventName: text("event_name").notNull(),
  description: text("description"),
  timezone: text("timezone").notNull(),
  showFromHour: integer("show_from_hour").notNull(),
  showToHour: integer("show_to_hour").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const meetingDates = pgTable(
  "meeting_dates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueMeetingDate: unique().on(table.meetingId, table.date),
  })
)

export const responses = pgTable(
  "responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    timeSlots: jsonb("time_slots").notNull().$type<string[]>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueResponse: unique().on(table.meetingId, table.name),
  })
)

export type Meeting = typeof meetings.$inferSelect
export type NewMeeting = typeof meetings.$inferInsert
export type MeetingDate = typeof meetingDates.$inferSelect
export type NewMeetingDate = typeof meetingDates.$inferInsert
export type Response = typeof responses.$inferSelect
export type NewResponse = typeof responses.$inferInsert
