CREATE TABLE "campaign_queues" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"queue_name" text NOT NULL,
	"worker_count" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "campaign_queues_queue_name_unique" UNIQUE("queue_name")
);
--> statement-breakpoint
ALTER TABLE "campaign_queues" ADD CONSTRAINT "campaign_queues_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;