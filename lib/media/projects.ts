import { prisma } from '@/lib/prisma';
import { githubProjects } from '@/lib/data/github-projects';
import type { Project } from '@/types';

function serialize(project: Project) {
    return {
        ...project,
        startDate: project.startDate instanceof Date ? project.startDate.toISOString() : project.startDate,
        endDate: project.endDate instanceof Date ? project.endDate.toISOString() : project.endDate,
        createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : project.createdAt,
        updatedAt: project.updatedAt instanceof Date ? project.updatedAt.toISOString() : project.updatedAt,
    };
}

/** Merge DB projects with the GitHub catalog so uploaded images stick. */
export async function getMergedProjects(featuredOnly = false) {
    let dbProjects: Project[] = [];

    try {
        dbProjects = await prisma.project.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        });
    } catch (error) {
        console.warn('Projects DB unavailable:', error);
    }

    const byGithub = new Map(
        dbProjects
            .filter((p) => p.githubUrl)
            .map((p) => [p.githubUrl as string, p])
    );

    const merged: Project[] = githubProjects.map((catalog) => {
        const fromDb = catalog.githubUrl ? byGithub.get(catalog.githubUrl) : undefined;
        if (fromDb) {
            byGithub.delete(catalog.githubUrl!);
            return fromDb;
        }
        return catalog;
    });

    // DB-only custom projects (no GitHub match)
    for (const leftover of byGithub.values()) {
        merged.push(leftover);
    }

    // Also include DB projects without githubUrl
    for (const p of dbProjects) {
        if (!p.githubUrl && !merged.find((m) => m.id === p.id)) {
            merged.push(p);
        }
    }

    merged.sort((a, b) => a.order - b.order || +new Date(b.createdAt) - +new Date(a.createdAt));

    const result = featuredOnly ? merged.filter((p) => p.featured) : merged;
    return result.map(serialize);
}

/** Ensure a catalog/DB project exists in Postgres so we can attach media. */
export async function ensureProjectInDb(input: {
    id?: string;
    githubUrl?: string | null;
}): Promise<{ id: string }> {
    if (input.id && !input.id.startsWith('gh-')) {
        const existing = await prisma.project.findUnique({ where: { id: input.id } });
        if (existing) return { id: existing.id };
    }

    if (input.githubUrl) {
        const byUrl = await prisma.project.findFirst({ where: { githubUrl: input.githubUrl } });
        if (byUrl) return { id: byUrl.id };
    }

    const catalog = githubProjects.find(
        (p) =>
            (input.id && p.id === input.id) ||
            (input.githubUrl && p.githubUrl === input.githubUrl)
    );

    if (!catalog) {
        throw new Error('Project not found');
    }

    const created = await prisma.project.create({
        data: {
            title_fr: catalog.title_fr,
            title_en: catalog.title_en,
            description_fr: catalog.description_fr,
            description_en: catalog.description_en,
            imageUrl: catalog.imageUrl,
            technologies: catalog.technologies,
            githubUrl: catalog.githubUrl,
            liveUrl: catalog.liveUrl,
            startDate: catalog.startDate,
            endDate: catalog.endDate,
            featured: catalog.featured,
            order: catalog.order,
        },
    });

    return { id: created.id };
}
