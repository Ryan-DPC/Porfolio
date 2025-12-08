import { supabaseAdmin } from './server';

const BUCKET_NAME = 'portfolio-files';

export interface UploadFileOptions {
    file: File;
    path: string;
    isPublic?: boolean;
}

export async function uploadFile({ file, path, isPublic = true }: UploadFileOptions) {
    const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
    }

    const url = getPublicUrl(path);

    return {
        path: data.path,
        url,
    };
}

export async function deleteFile(path: string) {
    const { error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
    }

    return { success: true };
}

export function getPublicUrl(path: string): string {
    const { data } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}

export async function downloadFile(path: string) {
    const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .download(path);

    if (error) {
        throw new Error(`Failed to download file: ${error.message}`);
    }

    return data;
}

export async function listFiles(folderPath?: string) {
    const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .list(folderPath || '', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' },
        });

    if (error) {
        throw new Error(`Failed to list files: ${error.message}`);
    }

    return data;
}
