CREATE TABLE "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"name" text NOT NULL,
	"time_slots" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "responses_meeting_id_name_unique" UNIQUE("meeting_id","name")
);
--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;