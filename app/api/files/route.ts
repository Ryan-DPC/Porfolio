import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { uploadFile } from '@/lib/supabase/storage';
import { validateFile } from '@/lib/utils/files';

// GET /api/files - List all files (optionally filtered by folderId)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get('folderId');

        const files = await prisma.file.findMany({
            where: {
                folderId: folderId || null,
                isPublic: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        const folders = await prisma.folder.findMany({
            where: {
                parentId: folderId || null,
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ files, folders });
    } catch (error) {
        console.error('Get files error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/files - Delete file (admin only)
export async function DELETE(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'File ID required' },
                { status: 400 }
            );
        }

        const file = await prisma.file.findUnique({
            where: { id },
        });

        if (!file) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // Delete from Supabase Storage
        const { deleteFile } = await import('@/lib/supabase/storage');
        await deleteFile(file.path);

        // Delete from database
        await prisma.file.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete file error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
