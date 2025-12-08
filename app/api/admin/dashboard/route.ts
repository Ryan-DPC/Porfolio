import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
    try {
        await requireAuth();

        const [projectCount, skillCount, blogCount, fileCount] = await Promise.all([
            prisma.project.count(),
            prisma.skill.count(),
            prisma.blogPost.count(),
            prisma.file.count(),
        ]);

        const recentProjects = await prisma.project.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            stats: {
                projects: projectCount,
                skills: skillCount,
                blogPosts: blogCount,
                files: fileCount,
            },
            recentProjects,
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
}
