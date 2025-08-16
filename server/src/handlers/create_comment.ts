import { type CreateCommentInput, type Comment } from '../schema';

export async function createComment(input: CreateCommentInput): Promise<Comment> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new comment on an article,
    // with spam detection and moderation queue (default status: pending).
    return Promise.resolve({
        id: 0, // Placeholder ID
        article_id: input.article_id,
        author_name: input.author_name,
        author_email: input.author_email,
        author_website: input.author_website,
        content: input.content,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
    } as Comment);
}