import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { storeMediaFile, removeMediaFile } from '@/lib/media/store';
import {
    CV_NAME_KEY,
    CV_PATH_KEY,
    CV_URL_KEY,
    deleteSetting,
    getCvInfo,
    setSetting,
} from '@/lib/media/settings';
import { isPDFFile } from '@/lib/utils/file-formatting';

export async function GET() {
    try {
        const cv = await getCvInfo();
        return NextResponse.json(cv);
    } catch (error) {
        console.error('Get CV error:', error);
        return NextResponse.json({ url: null, path: null, name: null });
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth();

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!isPDFFile(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ error: 'CV must be a PDF' }, { status: 400 });
        }

        if (file.size > 20 * 1024 * 1024) {
            return NextResponse.json({ error: 'CV max size is 20MB' }, { status: 400 });
        }

        const previous = await getCvInfo();
        const stored = await storeMediaFile(file, 'cv');

        try {
            await setSetting(CV_URL_KEY, stored.url);
            await setSetting(CV_PATH_KEY, stored.path);
            await setSetting(CV_NAME_KEY, file.name);
        } catch (dbError) {
            console.error('Failed to save CV settings (DB required):', dbError);
            return NextResponse.json(
                { error: 'Database required to save CV. Run prisma db push.' },
                { status: 503 }
            );
        }

        if (previous.path && previous.path !== stored.path) {
            await removeMediaFile(previous.path);
        }

        return NextResponse.json({
            success: true,
            url: stored.url,
            path: stored.path,
            name: file.name,
        });
    } catch (error) {
        console.error('Upload CV error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await requireAuth();
        const previous = await getCvInfo();

        if (previous.path) {
            await removeMediaFile(previous.path);
        }

        await deleteSetting(CV_URL_KEY);
        await deleteSetting(CV_PATH_KEY);
        await deleteSetting(CV_NAME_KEY);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete CV error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
