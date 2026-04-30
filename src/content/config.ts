import { defineCollection, z } from 'astro:content';

const tools = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    tagline: z.string(),
    category: z.enum(['ide', 'cli', 'extension', 'agent', 'platform']),
    pricing: z.object({
      free_tier: z.boolean(),
      paid_from_usd: z.number().optional(),
      enterprise: z.boolean().optional(),
      notes: z.string().optional(),
    }),
    repo: z.string().optional(),
    homepage: z.string(),
    docs: z.string().optional(),
    open_source: z.boolean(),
    license: z.string().optional(),
    languages: z.array(z.string()).default([]),
    models_supported: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    integrations: z.array(z.string()).default([]),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    best_for: z.array(z.string()).default([]),
    avoid_if: z.array(z.string()).default([]),
    affiliate_url: z.string().optional(),
    last_verified: z.string(),
  }),
});

const recipes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tools: z.array(z.string()),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    time_minutes: z.number(),
    tags: z.array(z.string()).default([]),
    updated: z.string(),
  }),
});

export const collections = { tools, recipes };
