import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createArticleInputSchema,
  updateArticleInputSchema,
  getArticleBySlugInputSchema,
  getPublishedArticlesInputSchema,
  getArticlesByCategoryInputSchema,
  getArticlesByTagInputSchema,
  createCategoryInputSchema,
  updateCategoryInputSchema,
  createTagInputSchema,
  createCommentInputSchema,
  updateCommentStatusInputSchema,
  getCommentsByArticleInputSchema
} from './schema';

// Import handlers
import { createArticle } from './handlers/create_article';
import { updateArticle } from './handlers/update_article';
import { getArticleBySlug } from './handlers/get_article_by_slug';
import { getPublishedArticles } from './handlers/get_published_articles';
import { getArticlesByCategory } from './handlers/get_articles_by_category';
import { getArticlesByTag } from './handlers/get_articles_by_tag';
import { deleteArticle } from './handlers/delete_article';
import { createCategory } from './handlers/create_category';
import { updateCategory } from './handlers/update_category';
import { getCategories } from './handlers/get_categories';
import { deleteCategory } from './handlers/delete_category';
import { createTag } from './handlers/create_tag';
import { getTags } from './handlers/get_tags';
import { deleteTag } from './handlers/delete_tag';
import { createComment } from './handlers/create_comment';
import { updateCommentStatus } from './handlers/update_comment_status';
import { getCommentsByArticle } from './handlers/get_comments_by_article';
import { deleteComment } from './handlers/delete_comment';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Article routes
  createArticle: publicProcedure
    .input(createArticleInputSchema)
    .mutation(({ input }) => createArticle(input)),

  updateArticle: publicProcedure
    .input(updateArticleInputSchema)
    .mutation(({ input }) => updateArticle(input)),

  getArticleBySlug: publicProcedure
    .input(getArticleBySlugInputSchema)
    .query(({ input }) => getArticleBySlug(input)),

  getPublishedArticles: publicProcedure
    .input(getPublishedArticlesInputSchema)
    .query(({ input }) => getPublishedArticles(input)),

  getArticlesByCategory: publicProcedure
    .input(getArticlesByCategoryInputSchema)
    .query(({ input }) => getArticlesByCategory(input)),

  getArticlesByTag: publicProcedure
    .input(getArticlesByTagInputSchema)
    .query(({ input }) => getArticlesByTag(input)),

  deleteArticle: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteArticle(input.id)),

  // Category routes
  createCategory: publicProcedure
    .input(createCategoryInputSchema)
    .mutation(({ input }) => createCategory(input)),

  updateCategory: publicProcedure
    .input(updateCategoryInputSchema)
    .mutation(({ input }) => updateCategory(input)),

  getCategories: publicProcedure
    .query(() => getCategories()),

  deleteCategory: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCategory(input.id)),

  // Tag routes
  createTag: publicProcedure
    .input(createTagInputSchema)
    .mutation(({ input }) => createTag(input)),

  getTags: publicProcedure
    .query(() => getTags()),

  deleteTag: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteTag(input.id)),

  // Comment routes
  createComment: publicProcedure
    .input(createCommentInputSchema)
    .mutation(({ input }) => createComment(input)),

  updateCommentStatus: publicProcedure
    .input(updateCommentStatusInputSchema)
    .mutation(({ input }) => updateCommentStatus(input)),

  getCommentsByArticle: publicProcedure
    .input(getCommentsByArticleInputSchema)
    .query(({ input }) => getCommentsByArticle(input)),

  deleteComment: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteComment(input.id))
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC blog server listening at port: ${port}`);
}

start();