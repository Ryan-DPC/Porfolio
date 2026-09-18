import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, requireAuth } from '@/lib/auth/session';
import { blogPostSchema } from '@/lib/utils/validation';
import { progressPosts } from '@/lib/data/progress-posts';

function serializePosts(posts: typeof progressPosts) {
    return posts.map((p) => ({
        ...p,
        publishedAt: p.publishedAt instanceof Date ? p.publishedAt.toISOString() : p.publishedAt,
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
        updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    }));
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all') === 'true';
        const session = all ? await getSession() : null;

        try {
            const posts = await prisma.blogPost.findMany({
                where: session ? undefined : { published: true },
                orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
            });

            if (posts.length > 0) {
                return NextResponse.json(posts);
            }
        } catch (dbError) {
            console.warn('Blog DB unavailable, using progress posts:', dbError);
        }

        if (session || !all) {
            const fallback = session
                ? progressPosts
                : progressPosts.filter((p) => p.published);
            return NextResponse.json(
                serializePosts(
                    [...fallback].sort((a, b) => {
                        const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
                        const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
                        return db - da;
                    })
                )
            );
        }

        return NextResponse.json([]);
    } catch (error) {
        console.error('Get blog posts error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const body = await request.json();
        const validatedData = blogPostSchema.parse(body);

        const post = await prisma.blogPost.create({
            data: {
                ...validatedData,
                publishedAt: validatedData.published
                    ? validatedData.publishedAt
                        ? new Date(validatedData.publishedAt)
                        : new Date()
                    : null,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Create blog post error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
