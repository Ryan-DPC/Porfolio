import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { projectSchema } from '@/lib/utils/validation';

// GET /api/projects - Get all projects (or filtered by locale/featured)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';

        const projects = await prisma.project.findMany({
            where: featured ? { featured: true } : undefined,
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create new project (admin only)
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
