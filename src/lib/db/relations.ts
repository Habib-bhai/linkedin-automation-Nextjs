// src/lib/db/relations.ts
import { relations } from 'drizzle-orm';
import {
  users,
  leadLists,
  leads,
  campaigns,
  workflowDefinitions,
  campaignRuns,
  campaignRunLeads,
  campaignFilters,
  nodeExecutions,
  campaignLogs,
  executorActions
} from './schema';

export const usersRelations = relations(users, ({ many }) => ({
  leadLists: many(leadLists),
  campaigns: many(campaigns),
  initiatedRuns: many(campaignRuns, { relationName: 'initiatedBy' }),
}));

export const leadListsRelations = relations(leadLists, ({ one, many }) => ({
  user: one(users, { fields: [leadLists.userId], references: [users.id] }),
  leads: many(leads),
  campaignFilters: many(campaignFilters),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  leadList: one(leadLists, { fields: [leads.leadListId], references: [leadLists.id] }),
  campaignRunLeads: many(campaignRunLeads),
  nodeExecutions: many(nodeExecutions),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, { fields: [campaigns.userId], references: [users.id] }),
  workflowDefinitions: many(workflowDefinitions),
  campaignRuns: many(campaignRuns),
}));

export const workflowDefinitionsRelations = relations(workflowDefinitions, ({ one, many }) => ({
  campaign: one(campaigns, { fields: [workflowDefinitions.campaignId], references: [campaigns.id] }),
  campaignRuns: many(campaignRuns),
}));

export const campaignRunsRelations = relations(campaignRuns, ({ one, many }) => ({
  campaign: one(campaigns, { fields: [campaignRuns.campaignId], references: [campaigns.id] }),
  workflowDefinition: one(workflowDefinitions, { fields: [campaignRuns.workflowDefinitionId], references: [workflowDefinitions.id] }),
  initiatedBy: one(users, { fields: [campaignRuns.initiatedBy], references: [users.id], relationName: 'initiatedBy' }),
  campaignRunLeads: many(campaignRunLeads),
  campaignFilters: many(campaignFilters),
  nodeExecutions: many(nodeExecutions),
  campaignLogs: many(campaignLogs),
}));

export const campaignRunLeadsRelations = relations(campaignRunLeads, ({ one }) => ({
  campaignRun: one(campaignRuns, { fields: [campaignRunLeads.campaignRunId], references: [campaignRuns.id] }),
  lead: one(leads, { fields: [campaignRunLeads.leadId], references: [leads.id] }),
}));

export const campaignFiltersRelations = relations(campaignFilters, ({ one }) => ({
  campaignRun: one(campaignRuns, { fields: [campaignFilters.campaignRunId], references: [campaignRuns.id] }),
  leadList: one(leadLists, { fields: [campaignFilters.leadListId], references: [leadLists.id] }),
}));

export const nodeExecutionsRelations = relations(nodeExecutions, ({ one }) => ({
  campaignRun: one(campaignRuns, { fields: [nodeExecutions.campaignRunId], references: [campaignRuns.id] }),
  lead: one(leads, { fields: [nodeExecutions.leadId], references: [leads.id] }),
}));

export const campaignLogsRelations = relations(campaignLogs, ({ one }) => ({
  campaignRun: one(campaignRuns, { fields: [campaignLogs.campaignRunId], references: [campaignRuns.id] }),
}));