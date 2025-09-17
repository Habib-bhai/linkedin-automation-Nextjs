import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
  
import { users, campaigns, leads, leadLists, workflowDefinitions, campaignRuns, campaignRunLeads, campaignFilters, nodeExecutions, campaignLogs, executorActions } from "@/lib/db/schema";

import * as schema from './schema';
import * as relations from './relations';

export const db = drizzle(process.env.DB_STRING!, {schema: {...schema, ...relations}});

// Export types for use in your application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type LeadList = typeof leadLists.$inferSelect;
export type NewLeadList = typeof leadLists.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type WorkflowDefinition = typeof workflowDefinitions.$inferSelect;
export type NewWorkflowDefinition = typeof workflowDefinitions.$inferInsert;

export type CampaignRun = typeof campaignRuns.$inferSelect;
export type NewCampaignRun = typeof campaignRuns.$inferInsert;

export type CampaignRunLead = typeof campaignRunLeads.$inferSelect;
export type NewCampaignRunLead = typeof campaignRunLeads.$inferInsert;

export type CampaignFilter = typeof campaignFilters.$inferSelect;
export type NewCampaignFilter = typeof campaignFilters.$inferInsert;

export type NodeExecution = typeof nodeExecutions.$inferSelect;
export type NewNodeExecution = typeof nodeExecutions.$inferInsert;

export type CampaignLog = typeof campaignLogs.$inferSelect;
export type NewCampaignLog = typeof campaignLogs.$inferInsert;

export type ExecutorAction = typeof executorActions.$inferSelect;
export type NewExecutorAction = typeof executorActions.$inferInsert;
