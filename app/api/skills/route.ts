import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { skillSchema } from '@/lib/utils/validation';

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
        });

        return NextResponse.json(skills);
    } catch (error) {
        console.error('Get skills error:', error);
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
        const validatedData = skillSchema.parse(body);

        const skill = await prisma.skill.create({
            data: validatedData,
        });

        return NextResponse.json(skill, { status: 201 });
    } catch (error) {
        console.error('Create skill error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
