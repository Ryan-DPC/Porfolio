import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { blogPostSchema } from '@/lib/utils/validation';
import { progressPosts } from '@/lib/data/progress-posts';

function serializePost(post: (typeof progressPosts)[number]) {
    return {
        ...post,
        publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt,
        createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
        updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
    };
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        try {
            const post = await prisma.blogPost.findFirst({
                where: {
                    OR: [{ id }, { slug: id }],
                },
            });

            if (post) {
                if (!post.published) {
                    try {
                        await requireAuth();
                    } catch {
                        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
                    }
                }
                return NextResponse.json(post);
            }
        } catch (dbError) {
            console.warn('Blog DB unavailable, checking progress posts:', dbError);
        }

        const fallback = progressPosts.find((p) => p.id === id || p.slug === id);
        if (!fallback || !fallback.published) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(serializePost(fallback));
    } catch (error) {
        console.error('Get blog post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;
        const body = await request.json();
        const validatedData = blogPostSchema.partial().parse(body);

        const existing = await prisma.blogPost.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const published = validatedData.published ?? existing.published;
        let publishedAt = existing.publishedAt;

        if (published && !publishedAt) {
            publishedAt = validatedData.publishedAt
                ? new Date(validatedData.publishedAt)
                : new Date();
        } else if (!published) {
            publishedAt = null;
        } else if (validatedData.publishedAt) {
            publishedAt = new Date(validatedData.publishedAt);
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                ...validatedData,
                publishedAt,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Update blog post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;

        await prisma.blogPost.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete blog post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
