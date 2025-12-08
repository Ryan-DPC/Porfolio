import { NextResponse } from 'next/server';
import { createZipFromFolder } from '@/lib/utils/files';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ folderId: string }> }
) {
    try {
        const { folderId } = await params;

        const zipBuffer = await createZipFromFolder(folderId);

        return new NextResponse(zipBuffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="folder_${folderId}.zip"`,
            },
        });
    } catch (error) {
        console.error('ZIP download error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
