import { boolean, index, integer, jsonb, PgJsonb, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});


// Lead Lists 
export const leadLists = pgTable('lead_lists', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  uploadStatus: varchar('upload_status', { length: 50 }).default('processing').notNull(),
  count: integer('count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('lead_lists_user_id_idx').on(table.userId),
  };
});

// Leads table
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  leadListId: integer('lead_list_id').references(() => leadLists.id, { onDelete: 'cascade' }).notNull(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  company: varchar('company', { length: 255 }),
  position: varchar('position', { length: 255 }),
  profileUrl: text('profile_url'),
  connected: boolean('connected').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    leadListIdIdx: index('leads_lead_list_id_idx').on(table.leadListId),
    companyIdx: index('leads_company_idx').on(table.company),
    positionIdx: index('leads_position_idx').on(table.position),
    emailIdx: index('leads_email_idx').on(table.email),
  };
});

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  errorStrategy: varchar('error_strategy', { length: 50 })
});

// Workflow Definitions table
export const workflowDefinitions = pgTable('workflow_definitions', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }).notNull(),
  version: integer('version').notNull().default(1),
  nodes: jsonb('nodes').notNull(),
  edges: jsonb('edges').notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    campaignIdIdx: index('workflow_def_campaign_id_idx').on(table.campaignId),
    uniqueActivePerCampaign: uniqueIndex('unique_active_def_per_campaign').on(table.campaignId).where(sql`${table.isActive} = true`),
  };
});

// Campaign Runs table
export const campaignRuns = pgTable('campaign_runs', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }).notNull(),
  workflowDefinitionId: integer('workflow_definition_id').references(() => workflowDefinitions.id).notNull(),
  status: varchar('status', { length: 50 }).default('queued').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }),
  endedAt: timestamp('ended_at', { withTimezone: true, mode: 'date' }),
  initiatedBy: integer('initiated_by').references(() => users.id),
  statsTotalLeads: integer('stats_total_leads').default(0),
  statsProcessed: integer('stats_processed').default(0),
  statsSuccess: integer('stats_success').default(0),
  statsFailed: integer('stats_failed').default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

// Campaign Run Leads table (final leads list for a run)
export const campaignRunLeads = pgTable('campaign_run_leads', {
  id: serial('id').primaryKey(),
  campaignRunId: integer('campaign_run_id').references(() => campaignRuns.id, { onDelete: 'cascade' }).notNull(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  snapshot: jsonb('snapshot').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    runIdStatusIdx: index('run_leads_run_id_status_idx').on(table.campaignRunId, table.status),
    uniqueRunLead: uniqueIndex('unique_run_lead').on(table.campaignRunId, table.leadId),
  };
});

// Campaign Filters table
export const campaignFilters = pgTable('campaign_filters', {
  id: serial('id').primaryKey(),
  campaignRunId: integer('campaign_run_id').references(() => campaignRuns.id, { onDelete: 'cascade' }).notNull(),
  leadListId: integer('lead_list_id').references(() => leadLists.id).notNull(),
  criteria: jsonb('criteria').notNull(),
  appliedAt: timestamp('applied_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

// Node Executions table
export const nodeExecutions = pgTable('node_executions', {
  id: serial('id').primaryKey(),
  campaignRunId: integer('campaign_run_id').references(() => campaignRuns.id, { onDelete: 'cascade' }).notNull(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  nodeId: varchar('node_id', { length: 255 }).notNull(),
  nodeType: varchar('node_type', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  input: jsonb('input'),
  output: jsonb('output'),
  error: text('error'),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'date' }),
}, (table) => {
  return {
    runIdLeadIdIdx: index('node_executions_run_lead_idx').on(table.campaignRunId, table.leadId),
    runIdIdx: index('node_executions_run_idx').on(table.campaignRunId),
    leadIdIdx: index('node_executions_lead_idx').on(table.leadId),
  };
});

// Campaign Logs table
export const campaignLogs = pgTable('campaign_logs', {
  id: serial('id').primaryKey(),
  campaignRunId: integer('campaign_run_id').references(() => campaignRuns.id, { onDelete: 'cascade' }).notNull(),
  level: varchar('level', { length: 20 }).default('info').notNull(),
  message: text('message').notNull(),
  nodeId: varchar('node_id', { length: 255 }),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    runIdIdx: index('campaign_logs_run_id_idx').on(table.campaignRunId),
  };
});

// Executor Actions table (registry of available node types)
export const executorActions = pgTable('executor_actions', {
  id: serial('id').primaryKey(),
  actionType: varchar('action_type', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  configSchema: jsonb('config_schema'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const campaignQueues = pgTable('campaign_queues', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  queueName: text('queue_name').notNull().unique(),
  workerCount: integer('worker_count').notNull().default(1),
  status: text('status').notNull().default('active'), // 'active', 'paused', 'drained'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});