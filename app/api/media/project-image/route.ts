import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { storeMediaFile, removeMediaFile } from '@/lib/media/store';
import { ensureProjectInDb } from '@/lib/media/projects';
import { isImageFile } from '@/lib/utils/file-formatting';

export async function POST(request: Request) {
    try {
        await requireAuth();

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const projectId = (formData.get('projectId') as string | null) || undefined;
        const githubUrl = (formData.get('githubUrl') as string | null) || undefined;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!isImageFile(file.type)) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image max size is 10MB' }, { status: 400 });
        }

        if (!projectId && !githubUrl) {
            return NextResponse.json(
                { error: 'projectId or githubUrl required' },
                { status: 400 }
            );
        }

        let dbId: string;
        try {
            ({ id: dbId } = await ensureProjectInDb({ id: projectId, githubUrl }));
        } catch {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const existing = await prisma.project.findUnique({ where: { id: dbId } });
        const stored = await storeMediaFile(file, 'projects');

        const project = await prisma.project.update({
            where: { id: dbId },
            data: { imageUrl: stored.url },
        });

        // Best-effort cleanup of previous local/supabase path when it was a local upload
        if (existing?.imageUrl?.startsWith('/uploads/')) {
            await removeMediaFile(existing.imageUrl.replace(/^\//, ''));
        }

        return NextResponse.json({
            success: true,
            project,
            imageUrl: stored.url,
        });
    } catch (error) {
        console.error('Upload project image error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const githubUrl = searchParams.get('githubUrl');

        if (!projectId && !githubUrl) {
            return NextResponse.json(
                { error: 'projectId or githubUrl required' },
                { status: 400 }
            );
        }

        const project = projectId && !projectId.startsWith('gh-')
            ? await prisma.project.findUnique({ where: { id: projectId } })
            : await prisma.project.findFirst({
                  where: githubUrl ? { githubUrl } : undefined,
              });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (project.imageUrl?.startsWith('/uploads/')) {
            await removeMediaFile(project.imageUrl.replace(/^\//, ''));
        }

        const updated = await prisma.project.update({
            where: { id: project.id },
            data: { imageUrl: null },
        });

        return NextResponse.json({ success: true, project: updated });
    } catch (error) {
        console.error('Delete project image error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
