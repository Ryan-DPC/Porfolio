import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { getPublicUrl, uploadFile as uploadToSupabase, deleteFile as deleteFromSupabase } from '@/lib/supabase/storage';

function sanitizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

/**
 * Store a public media file. Prefers Supabase Storage; falls back to
 * public/uploads for local/dev when Supabase is not configured.
 */
export async function storeMediaFile(
    file: File,
    folder: string
): Promise<{ url: string; path: string; storage: 'supabase' | 'local' }> {
    const timestamp = Date.now();
    const sanitized = sanitizeName(file.name);
    const relativePath = `${folder}/${timestamp}_${sanitized}`;

    try {
        if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { url, path: storedPath } = await uploadToSupabase({
                file,
                path: relativePath,
            });
            return { url, path: storedPath, storage: 'supabase' };
        }
    } catch (error) {
        console.warn('Supabase upload failed, falling back to local:', error);
    }

    const publicDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(publicDir, { recursive: true });
    const filename = `${timestamp}_${sanitized}`;
    const diskPath = path.join(publicDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(diskPath, buffer);

    return {
        url: `/uploads/${folder}/${filename}`,
        path: `uploads/${folder}/${filename}`,
        storage: 'local',
    };
}

export async function removeMediaFile(storedPath: string): Promise<void> {
    if (!storedPath) return;

    if (storedPath.startsWith('uploads/')) {
        try {
            await unlink(path.join(process.cwd(), 'public', storedPath));
        } catch {
            // ignore missing local file
        }
        return;
    }

    try {
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            await deleteFromSupabase(storedPath);
        }
    } catch (error) {
        console.warn('Failed to delete remote media:', error);
    }
}

export { getPublicUrl };
