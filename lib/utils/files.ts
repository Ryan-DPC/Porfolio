import archiver from 'archiver';

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

// Utilities moved to ./file-formatting.ts
export {
    formatFileSize,
    getFileExtension,
    isImageFile,
    isVideoFile,
    isPDFFile,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES,
    validateFile
} from './file-formatting';

