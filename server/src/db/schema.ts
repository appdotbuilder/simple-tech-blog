import { serial, text, pgTable, timestamp, integer, pgEnum, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const articleStatusEnum = pgEnum('article_status', ['draft', 'published', 'archived']);
export const commentStatusEnum = pgEnum('comment_status', ['pending', 'approved', 'rejected', 'spam']);

// Articles table
export const articlesTable = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featured_image: text('featured_image'),
  status: articleStatusEnum('status').notNull().default('draft'),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  view_count: integer('view_count').notNull().default(0),
  reading_time_minutes: integer('reading_time_minutes')
}, (table) => ({
  slugIdx: index('articles_slug_idx').on(table.slug),
  statusIdx: index('articles_status_idx').on(table.status),
  publishedAtIdx: index('articles_published_at_idx').on(table.published_at)
}));

// Categories table
export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  color: text('color'), // Hex color for UI
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug)
}));

// Tags table
export const tagsTable = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  slugIdx: index('tags_slug_idx').on(table.slug)
}));

// Comments table
export const commentsTable = pgTable('comments', {
  id: serial('id').primaryKey(),
  article_id: integer('article_id').notNull().references(() => articlesTable.id, { onDelete: 'cascade' }),
  author_name: text('author_name').notNull(),
  author_email: text('author_email').notNull(),
  author_website: text('author_website'),
  content: text('content').notNull(),
  status: commentStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  articleIdIdx: index('comments_article_id_idx').on(table.article_id),
  statusIdx: index('comments_status_idx').on(table.status)
}));

// Junction table for article-category many-to-many relationship
export const articleCategoriesTable = pgTable('article_categories', {
  article_id: integer('article_id').notNull().references(() => articlesTable.id, { onDelete: 'cascade' }),
  category_id: integer('category_id').notNull().references(() => categoriesTable.id, { onDelete: 'cascade' })
}, (table) => ({
  pk: primaryKey({ columns: [table.article_id, table.category_id] }),
  articleIdIdx: index('article_categories_article_id_idx').on(table.article_id),
  categoryIdIdx: index('article_categories_category_id_idx').on(table.category_id)
}));

// Junction table for article-tag many-to-many relationship
export const articleTagsTable = pgTable('article_tags', {
  article_id: integer('article_id').notNull().references(() => articlesTable.id, { onDelete: 'cascade' }),
  tag_id: integer('tag_id').notNull().references(() => tagsTable.id, { onDelete: 'cascade' })
}, (table) => ({
  pk: primaryKey({ columns: [table.article_id, table.tag_id] }),
  articleIdIdx: index('article_tags_article_id_idx').on(table.article_id),
  tagIdIdx: index('article_tags_tag_id_idx').on(table.tag_id)
}));

// Relations
export const articlesRelations = relations(articlesTable, ({ many }) => ({
  comments: many(commentsTable),
  articleCategories: many(articleCategoriesTable),
  articleTags: many(articleTagsTable)
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  articleCategories: many(articleCategoriesTable)
}));

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  articleTags: many(articleTagsTable)
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  article: one(articlesTable, {
    fields: [commentsTable.article_id],
    references: [articlesTable.id]
  })
}));

export const articleCategoriesRelations = relations(articleCategoriesTable, ({ one }) => ({
  article: one(articlesTable, {
    fields: [articleCategoriesTable.article_id],
    references: [articlesTable.id]
  }),
  category: one(categoriesTable, {
    fields: [articleCategoriesTable.category_id],
    references: [categoriesTable.id]
  })
}));

export const articleTagsRelations = relations(articleTagsTable, ({ one }) => ({
  article: one(articlesTable, {
    fields: [articleTagsTable.article_id],
    references: [articlesTable.id]
  }),
  tag: one(tagsTable, {
    fields: [articleTagsTable.tag_id],
    references: [tagsTable.id]
  })
}));

// TypeScript types for the table schemas
export type Article = typeof articlesTable.$inferSelect;
export type NewArticle = typeof articlesTable.$inferInsert;

export type Category = typeof categoriesTable.$inferSelect;
export type NewCategory = typeof categoriesTable.$inferInsert;

export type Tag = typeof tagsTable.$inferSelect;
export type NewTag = typeof tagsTable.$inferInsert;

export type Comment = typeof commentsTable.$inferSelect;
export type NewComment = typeof commentsTable.$inferInsert;

export type ArticleCategory = typeof articleCategoriesTable.$inferSelect;
export type NewArticleCategory = typeof articleCategoriesTable.$inferInsert;

export type ArticleTag = typeof articleTagsTable.$inferSelect;
export type NewArticleTag = typeof articleTagsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  articles: articlesTable,
  categories: categoriesTable,
  tags: tagsTable,
  comments: commentsTable,
  articleCategories: articleCategoriesTable,
  articleTags: articleTagsTable
};