import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { folderSchema } from '@/lib/utils/validation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get('parentId');

        const folders = await prisma.folder.findMany({
            where: { parentId: parentId || null },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(folders);
    } catch (error) {
        console.error('Get folders error:', error);
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
        const validatedData = folderSchema.parse(body);

        const folder = await prisma.folder.create({
            data: {
                name: validatedData.name,
                parentId: validatedData.parentId || null,
            },
        });

        return NextResponse.json(folder, { status: 201 });
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
