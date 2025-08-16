import { z } from 'zod';

// Article schema
export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(), // Rich content (HTML/Markdown)
  excerpt: z.string().nullable(), // Short description
  featured_image: z.string().nullable(), // Image URL
  status: z.enum(['draft', 'published', 'archived']),
  published_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  view_count: z.number().int(),
  reading_time_minutes: z.number().int().nullable() // Estimated reading time
});

export type Article = z.infer<typeof articleSchema>;

// Category schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(), // Hex color for UI
  created_at: z.coerce.date()
});

export type Category = z.infer<typeof categorySchema>;

// Tag schema
export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  created_at: z.coerce.date()
});

export type Tag = z.infer<typeof tagSchema>;

// Comment schema
export const commentSchema = z.object({
  id: z.number(),
  article_id: z.number(),
  author_name: z.string(),
  author_email: z.string().email(),
  author_website: z.string().url().nullable(),
  content: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'spam']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Comment = z.infer<typeof commentSchema>;

// Article-Category junction
export const articleCategorySchema = z.object({
  article_id: z.number(),
  category_id: z.number()
});

export type ArticleCategory = z.infer<typeof articleCategorySchema>;

// Article-Tag junction
export const articleTagSchema = z.object({
  article_id: z.number(),
  tag_id: z.number()
});

export type ArticleTag = z.infer<typeof articleTagSchema>;

// Input schemas for creating articles
export const createArticleInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  excerpt: z.string().nullable(),
  featured_image: z.string().url().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  published_at: z.coerce.date().nullable(),
  reading_time_minutes: z.number().int().positive().nullable(),
  category_ids: z.array(z.number()).default([]),
  tag_ids: z.array(z.number()).default([])
});

export type CreateArticleInput = z.infer<typeof createArticleInputSchema>;

// Input schemas for updating articles
export const updateArticleInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().optional(),
  excerpt: z.string().nullable().optional(),
  featured_image: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  published_at: z.coerce.date().nullable().optional(),
  reading_time_minutes: z.number().int().positive().nullable().optional(),
  category_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional()
});

export type UpdateArticleInput = z.infer<typeof updateArticleInputSchema>;

// Input schemas for creating categories
export const createCategoryInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable() // Hex color validation
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

// Input schemas for updating categories
export const updateCategoryInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional()
});

export type UpdateCategoryInput = z.infer<typeof updateCategoryInputSchema>;

// Input schemas for creating tags
export const createTagInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1)
});

export type CreateTagInput = z.infer<typeof createTagInputSchema>;

// Input schemas for creating comments
export const createCommentInputSchema = z.object({
  article_id: z.number(),
  author_name: z.string().min(1).max(100),
  author_email: z.string().email(),
  author_website: z.string().url().nullable(),
  content: z.string().min(1).max(2000)
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

// Input schemas for updating comment status
export const updateCommentStatusInputSchema = z.object({
  id: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'spam'])
});

export type UpdateCommentStatusInput = z.infer<typeof updateCommentStatusInputSchema>;

// Query schemas
export const getArticleBySlugInputSchema = z.object({
  slug: z.string()
});

export type GetArticleBySlugInput = z.infer<typeof getArticleBySlugInputSchema>;

export const getArticlesByTagInputSchema = z.object({
  tag_slug: z.string(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type GetArticlesByTagInput = z.infer<typeof getArticlesByTagInputSchema>;

export const getArticlesByCategoryInputSchema = z.object({
  category_slug: z.string(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type GetArticlesByCategoryInput = z.infer<typeof getArticlesByCategoryInputSchema>;

export const getPublishedArticlesInputSchema = z.object({
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type GetPublishedArticlesInput = z.infer<typeof getPublishedArticlesInputSchema>;

export const getCommentsByArticleInputSchema = z.object({
  article_id: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'spam']).optional()
});

export type GetCommentsByArticleInput = z.infer<typeof getCommentsByArticleInputSchema>;