import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { projectSchema } from '@/lib/utils/validation';
import { githubProjects } from '@/lib/data/github-projects';

function serializeProjects(projects: typeof githubProjects) {
    return projects.map((p) => ({
        ...p,
        startDate: p.startDate instanceof Date ? p.startDate.toISOString() : p.startDate,
        endDate: p.endDate instanceof Date ? p.endDate.toISOString() : p.endDate,
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
        updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    }));
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';

        try {
            const projects = await prisma.project.findMany({
                where: featured ? { featured: true } : undefined,
                orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
            });

            if (projects.length > 0) {
                return NextResponse.json(projects);
            }
        } catch (dbError) {
            console.warn('Projects DB unavailable, using GitHub catalog:', dbError);
        }

        const fallback = featured
            ? githubProjects.filter((p) => p.featured)
            : githubProjects;

        return NextResponse.json(serializeProjects(fallback));
    } catch (error) {
        console.error('Get projects error:', error);
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
        const validatedData = projectSchema.parse(body);

        const project = await prisma.project.create({
            data: {
                ...validatedData,
                startDate: new Date(validatedData.startDate),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
