import { z } from 'zod';

export const SearchYtKnowledgeSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  limit: z.number().min(1).max(20).optional().default(5),
  videoId: z.string().optional(),
  topics: z.array(z.string()).optional(),
  contextWindowSeconds: z.number().min(0).optional().default(30),
  minSimilarity: z.number().min(0).max(1).optional().default(0.3),
});

export const GetVideoTranscriptRangeSchema = z.object({
  videoId: z.string().min(1, 'Video ID is required'),
  startSeconds: z.number().min(0, 'Start seconds must be >= 0'),
  endSeconds: z.number().min(0, 'End seconds must be >= 0'),
});

export const ListYtVideosSchema = z.object({
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(50).optional().default(25),
});

export const GetYtVideoSummarySchema = z.object({
  videoId: z.string().min(1, 'Video ID is required'),
});
