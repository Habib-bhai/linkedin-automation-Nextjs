import z from "zod";

export const startRunSchema = z.object({
  campaignId: z.number().int().positive(),
  leadListId: z.number().int().positive(),
  filters: z.record(z.any(),z.any() ).optional(), // arbitrary JSON filter object
});
