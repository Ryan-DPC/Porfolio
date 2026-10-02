/**
 * Seed GitHub projects + progress journal + admin into Postgres.
 *
 * Usage (with DATABASE_URL set):
 *   npx tsx prisma/seed.ts
 *   # or: npm run db:seed
 *
 * Admin password: set ADMIN_PASSWORD to override the default hash,
 * or leave unset to seed ryan.depina@eduvaud.ch with the configured hash.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { githubProjects } from '../lib/data/github-projects';
import { progressPosts } from '../lib/data/progress-posts';

const prisma = new PrismaClient();

const DEFAULT_ADMIN_EMAIL = 'ryan.depina@eduvaud.ch';
/** bcrypt hash for the portfolio admin password (plaintext never committed). */
const DEFAULT_ADMIN_PASSWORD_HASH =
    '$2a$10$pT1sC3BZI33/uABGI8CCf.0.9fNPCIXXF/oS..SSgUINrnVcEoeqC';

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
    const name = process.env.ADMIN_NAME || 'Ryan De Pina Correia';
    const passwordHash = process.env.ADMIN_PASSWORD
        ? await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
        : DEFAULT_ADMIN_PASSWORD_HASH;

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            name,
            role: 'admin',
        },
        create: {
            email,
            passwordHash,
            name,
            role: 'admin',
        },
    });

    console.log('Admin ready:', user.email);
}

async function main() {
    await seedAdmin();

    for (const project of githubProjects) {
        const existing = await prisma.project.findFirst({
            where: { githubUrl: project.githubUrl },
        });

        const data = {
            title_fr: project.title_fr,
            title_en: project.title_en,
            description_fr: project.description_fr,
            description_en: project.description_en,
            imageUrl: project.imageUrl,
            technologies: project.technologies,
            githubUrl: project.githubUrl,
            liveUrl: project.liveUrl,
            startDate: project.startDate,
            endDate: project.endDate,
            featured: project.featured,
            order: project.order,
        };

        if (existing) {
            await prisma.project.update({ where: { id: existing.id }, data });
            console.log('Updated project:', project.title_en);
        } else {
            await prisma.project.create({ data });
            console.log('Created project:', project.title_en);
        }
    }

    for (const post of progressPosts) {
        const existing = await prisma.blogPost.findUnique({
            where: { slug: post.slug },
        });

        const data = {
            slug: post.slug,
            title_fr: post.title_fr,
            title_en: post.title_en,
            content_fr: post.content_fr,
            content_en: post.content_en,
            excerpt_fr: post.excerpt_fr,
            excerpt_en: post.excerpt_en,
            coverImage: post.coverImage,
            published: post.published,
            publishedAt: post.publishedAt,
        };

        if (existing) {
            await prisma.blogPost.update({ where: { id: existing.id }, data });
            console.log('Updated post:', post.slug);
        } else {
            await prisma.blogPost.create({ data });
            console.log('Created post:', post.slug);
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
