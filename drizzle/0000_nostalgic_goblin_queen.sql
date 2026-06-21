CREATE TABLE "meeting_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meeting_dates_meeting_id_date_unique" UNIQUE("meeting_id","date")
);
--> statement-breakpoint
CREATE TABLE "meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"event_name" text NOT NULL,
	"description" text,
	"timezone" text NOT NULL,
	"show_from_hour" integer NOT NULL,
	"show_to_hour" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meetings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "meeting_dates" ADD CONSTRAINT "meeting_dates_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;