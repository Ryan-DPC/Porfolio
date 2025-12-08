import archiver from 'archiver';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';
import { downloadFile } from '@/lib/supabase/storage';

export interface FileTreeItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    path?: string;
    size?: number;
    children?: FileTreeItem[];
}

export async function createZipFromFolder(folderId: string): Promise<Buffer> {
    const archive = archiver('zip', {
        zlib: { level: 9 },
    });

    const buffers: Buffer[] = [];

    archive.on('data', (chunk) => {
        buffers.push(chunk);
    });

    await addFolderToArchive(archive, folderId, '');

    archive.finalize();

    return new Promise((resolve, reject) => {
        archive.on('end', () => {
            resolve(Buffer.concat(buffers));
        });
        archive.on('error', reject);
    });
}

async function addFolderToArchive(archive: archiver.Archiver, folderId: string, basePath: string) {
    const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        include: {
            files: true,
            children: true,
        },
    });

    if (!folder) {
        throw new Error('Folder not found');
    }

    // Add files
    for (const file of folder.files) {
        try {
            const blob = await downloadFile(file.path);
            const buffer = Buffer.from(await blob.arrayBuffer());
            const filePath = basePath ? `${basePath}/${file.name}` : file.name;
            archive.append(buffer, { name: filePath });
        } catch (error) {
            console.error(`Failed to add file ${file.name} to archive:`, error);
        }
    }

    // Add subfolders recursively
    for (const child of folder.children) {
        const childPath = basePath ? `${basePath}/${child.name}` : child.name;
        await addFolderToArchive(archive, child.id, childPath);
    }
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
}

export function isVideoFile(mimeType: string): boolean {
    return mimeType.startsWith('video/');
}

export function isPDFFile(mimeType: string): boolean {
    return mimeType === 'application/pdf';
}

export const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
export const ALLOWED_FILE_TYPES = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',

    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',

    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',

    // Text
    'text/plain',
    'text/csv',
    'application/json',

    // Executables
    'application/x-msdownload',
    'application/x-executable',
];

export function validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size exceeds 1GB limit' };
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
}
