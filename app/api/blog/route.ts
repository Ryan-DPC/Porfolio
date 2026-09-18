import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, requireAuth } from '@/lib/auth/session';
import { blogPostSchema } from '@/lib/utils/validation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all') === 'true';
        const session = all ? await getSession() : null;

        const posts = await prisma.blogPost.findMany({
            where: session ? undefined : { published: true },
            orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        });

        return NextResponse.json(posts);
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
