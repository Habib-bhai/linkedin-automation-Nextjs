CREATE TABLE "campaign_filters" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_run_id" integer NOT NULL,
	"lead_list_id" integer NOT NULL,
	"criteria" jsonb NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_run_id" integer NOT NULL,
	"level" varchar(20) DEFAULT 'info' NOT NULL,
	"message" text NOT NULL,
	"node_id" varchar(255),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_run_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_run_id" integer NOT NULL,
	"lead_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"workflow_definition_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'queued' NOT NULL,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"initiated_by" integer,
	"stats_total_leads" integer DEFAULT 0,
	"stats_processed" integer DEFAULT 0,
	"stats_success" integer DEFAULT 0,
	"stats_failed" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "executor_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_type" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"config_schema" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "executor_actions_action_type_unique" UNIQUE("action_type")
);
--> statement-breakpoint
CREATE TABLE "lead_lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"upload_status" varchar(50) DEFAULT 'processing' NOT NULL,
	"count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_list_id" integer NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"company" varchar(255),
	"position" varchar(255),
	"profile_url" text,
	"connected" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "node_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_run_id" integer NOT NULL,
	"lead_id" integer NOT NULL,
	"node_id" varchar(255) NOT NULL,
	"node_type" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"error" text,
	"started_at" timestamp with time zone NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workflow_definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"nodes" jsonb NOT NULL,
	"edges" jsonb NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaign_filters" ADD CONSTRAINT "campaign_filters_campaign_run_id_campaign_runs_id_fk" FOREIGN KEY ("campaign_run_id") REFERENCES "public"."campaign_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_filters" ADD CONSTRAINT "campaign_filters_lead_list_id_lead_lists_id_fk" FOREIGN KEY ("lead_list_id") REFERENCES "public"."lead_lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_logs" ADD CONSTRAINT "campaign_logs_campaign_run_id_campaign_runs_id_fk" FOREIGN KEY ("campaign_run_id") REFERENCES "public"."campaign_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_run_leads" ADD CONSTRAINT "campaign_run_leads_campaign_run_id_campaign_runs_id_fk" FOREIGN KEY ("campaign_run_id") REFERENCES "public"."campaign_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_run_leads" ADD CONSTRAINT "campaign_run_leads_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_runs" ADD CONSTRAINT "campaign_runs_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_runs" ADD CONSTRAINT "campaign_runs_workflow_definition_id_workflow_definitions_id_fk" FOREIGN KEY ("workflow_definition_id") REFERENCES "public"."workflow_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_runs" ADD CONSTRAINT "campaign_runs_initiated_by_users_id_fk" FOREIGN KEY ("initiated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_lists" ADD CONSTRAINT "lead_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_lead_list_id_lead_lists_id_fk" FOREIGN KEY ("lead_list_id") REFERENCES "public"."lead_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_executions" ADD CONSTRAINT "node_executions_campaign_run_id_campaign_runs_id_fk" FOREIGN KEY ("campaign_run_id") REFERENCES "public"."campaign_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_executions" ADD CONSTRAINT "node_executions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_definitions" ADD CONSTRAINT "workflow_definitions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "campaign_logs_run_id_idx" ON "campaign_logs" USING btree ("campaign_run_id");--> statement-breakpoint
CREATE INDEX "run_leads_run_id_status_idx" ON "campaign_run_leads" USING btree ("campaign_run_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_run_lead" ON "campaign_run_leads" USING btree ("campaign_run_id","lead_id");--> statement-breakpoint
CREATE INDEX "lead_lists_user_id_idx" ON "lead_lists" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "leads_lead_list_id_idx" ON "leads" USING btree ("lead_list_id");--> statement-breakpoint
CREATE INDEX "leads_company_idx" ON "leads" USING btree ("company");--> statement-breakpoint
CREATE INDEX "leads_position_idx" ON "leads" USING btree ("position");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "node_executions_run_lead_idx" ON "node_executions" USING btree ("campaign_run_id","lead_id");--> statement-breakpoint
CREATE INDEX "node_executions_run_idx" ON "node_executions" USING btree ("campaign_run_id");--> statement-breakpoint
CREATE INDEX "node_executions_lead_idx" ON "node_executions" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "workflow_def_campaign_id_idx" ON "workflow_definitions" USING btree ("campaign_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_def_per_campaign" ON "workflow_definitions" USING btree ("campaign_id") WHERE "workflow_definitions"."is_active" = true;