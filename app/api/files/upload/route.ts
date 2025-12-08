import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { uploadFile, getPublicUrl } from '@/lib/supabase/storage';
import { validateFile } from '@/lib/utils/files';

export async function POST(request: Request) {
    try {
        await requireAuth();

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const folderId = formData.get('folderId') as string | null;

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        const uploadedFiles = [];

        for (const file of files) {
            // Validate file
            const validation = validateFile(file);
            if (!validation.valid) {
                return NextResponse.json(
                    { error: validation.error },
                    { status: 400 }
                );
            }

            // Generate unique filename
            const timestamp = Date.now();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const path = `files/${timestamp}_${sanitizedName}`;

            // Upload to Supabase
            const { url } = await uploadFile({
                file,
                path,
                isPublic: true,
            });

            // Save to database
            const dbFile = await prisma.file.create({
                data: {
                    name: sanitizedName,
                    originalName: file.name,
                    path,
                    size: file.size,
                    mimeType: file.type,
                    folderId: folderId || null,
                    isPublic: true,
                    downloadUrl: url,
                },
            });

            uploadedFiles.push(dbFile);
        }

        return NextResponse.json({
            success: true,
            files: uploadedFiles,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
