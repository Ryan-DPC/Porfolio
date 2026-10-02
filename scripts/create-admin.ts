/**
 * Create or update the admin user from env vars.
 *
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/create-admin.ts
 *   # or: npm run db:create-admin
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Ryan De Pina Correia';

    if (!email || !password) {
        throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment');
    }

    if (password.length < 8) {
        throw new Error('ADMIN_PASSWORD must be at least 8 characters');
    }

    const passwordHash = await bcrypt.hash(password, 10);

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

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
