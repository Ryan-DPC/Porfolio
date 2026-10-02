import { prisma } from '@/lib/prisma';

export const CV_URL_KEY = 'cv_url';
export const CV_PATH_KEY = 'cv_path';
export const CV_NAME_KEY = 'cv_name';

export async function getSetting(key: string): Promise<string | null> {
    try {
        const row = await prisma.siteSetting.findUnique({ where: { key } });
        return row?.value ?? null;
    } catch {
        return null;
    }
}

export async function setSetting(key: string, value: string): Promise<void> {
    await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });
}

export async function deleteSetting(key: string): Promise<void> {
    try {
        await prisma.siteSetting.delete({ where: { key } });
    } catch {
        // ignore missing
    }
}

export async function getCvInfo(): Promise<{
    url: string | null;
    path: string | null;
    name: string | null;
}> {
    const [url, path, name] = await Promise.all([
        getSetting(CV_URL_KEY),
        getSetting(CV_PATH_KEY),
        getSetting(CV_NAME_KEY),
    ]);
    return { url, path, name };
}
