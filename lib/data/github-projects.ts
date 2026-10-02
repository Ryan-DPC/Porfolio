import type { Project } from '@/types';

/**
 * Curated GitHub projects for Ryan-DPC.
 * Used as fallback when the database has no projects yet,
 * and as seed source for prisma db seed.
 */
export const githubProjects: Project[] = [
    {
        id: 'gh-vext-platform',
        title_fr: 'Vext Platform',
        title_en: 'Vext Platform',
        description_fr:
            'Plateforme moderne de distribution de jeux : store, écosystème social, lobbies en temps réel et expérience desktop intégrée. Stack Tauri, Vue, Bun et Elysia.',
        description_en:
            'Modern game distribution platform: storefront, social ecosystem, real-time lobbies, and a seamless desktop experience. Built with Tauri, Vue, Bun, and Elysia.',
        imageUrl: null,
        technologies: ['TypeScript', 'Vue.js', 'Tauri', 'Bun', 'Elysia', 'TailwindCSS'],
        githubUrl: 'https://github.com/Ryan-DPC/Vext-platform',
        liveUrl: null,
        startDate: new Date('2025-12-18'),
        endDate: null,
        featured: true,
        order: 0,
        createdAt: new Date('2025-12-18'),
        updatedAt: new Date('2026-08-18'),
    },
    {
        id: 'gh-crimsons',
        title_fr: 'Crimsons',
        title_en: 'Crimsons',
        description_fr:
            'Projet web en HTML/CSS/JS — expérimentation visuelle et gameplay côté navigateur.',
        description_en:
            'Web project in HTML/CSS/JS — visual and gameplay experimentation in the browser.',
        imageUrl: null,
        technologies: ['HTML', 'CSS', 'JavaScript'],
        githubUrl: 'https://github.com/Ryan-DPC/Crimsons',
        liveUrl: null,
        startDate: new Date('2026-03-31'),
        endDate: null,
        featured: true,
        order: 1,
        createdAt: new Date('2026-03-31'),
        updatedAt: new Date('2026-09-14'),
    },
    {
        id: 'gh-ether-chess',
        title_fr: 'EtherChess',
        title_en: 'EtherChess',
        description_fr:
            'Jeu d’échecs développé en C# pour l’écosystème Ether / Vext — test d’intégration jeu ↔ launcher.',
        description_en:
            'Chess game built in C# for the Ether / Vext ecosystem — game ↔ launcher integration test.',
        imageUrl: null,
        technologies: ['C#', 'Game Dev'],
        githubUrl: 'https://github.com/Ryan-DPC/EtherChess',
        liveUrl: null,
        startDate: new Date('2025-12-10'),
        endDate: null,
        featured: false,
        order: 2,
        createdAt: new Date('2025-12-10'),
        updatedAt: new Date('2026-08-19'),
    },
    {
        id: 'gh-spludbuster',
        title_fr: 'SpludBuster',
        title_en: 'SpludBuster',
        description_fr:
            'Jeu type Brotato créé pour tester l’application Ether — combat, vagues et boucle de progression.',
        description_en:
            'Brotato-like game built to test the Ether app — combat, waves, and progression loop.',
        imageUrl: null,
        technologies: ['JavaScript', 'Game Dev'],
        githubUrl: 'https://github.com/Ryan-DPC/SpludBuster',
        liveUrl: null,
        startDate: new Date('2025-11-25'),
        endDate: null,
        featured: false,
        order: 3,
        createdAt: new Date('2025-11-25'),
        updatedAt: new Date('2025-12-10'),
    },
    {
        id: 'gh-stick-fighter',
        title_fr: 'Stick Fighter',
        title_en: 'Stick Fighter',
        description_fr:
            'Jeu de combat basique pour tester le online et l’auth entre Ether et un jeu.',
        description_en:
            'Basic fighting game to test online play and auth between Ether and a game.',
        imageUrl: null,
        technologies: ['JavaScript', 'Online', 'Auth'],
        githubUrl: 'https://github.com/Ryan-DPC/Stick-Fighter',
        liveUrl: null,
        startDate: new Date('2025-11-25'),
        endDate: null,
        featured: false,
        order: 4,
        createdAt: new Date('2025-11-25'),
        updatedAt: new Date('2026-01-08'),
    },
    {
        id: 'gh-portfolio',
        title_fr: 'Portfolio personnel',
        title_en: 'Personal portfolio',
        description_fr:
            'Ce site : portfolio full-stack Next.js avec admin, i18n FR/EN, fichiers et blog d’avancement.',
        description_en:
            'This site: full-stack Next.js portfolio with admin, FR/EN i18n, files, and progress journal.',
        imageUrl: null,
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'Supabase', 'TailwindCSS'],
        githubUrl: 'https://github.com/Ryan-DPC/Porfolio',
        liveUrl: null,
        startDate: new Date('2025-12-08'),
        endDate: null,
        featured: true,
        order: 5,
        createdAt: new Date('2025-12-08'),
        updatedAt: new Date('2026-09-18'),
    },
    {
        id: 'gh-blog-flask-react',
        title_fr: 'Blog Flask + React',
        title_en: 'Flask + React blog',
        description_fr:
            'Application blog full-stack avec API Flask et frontend React — exercice d’architecture web.',
        description_en:
            'Full-stack blog app with Flask API and React frontend — web architecture practice.',
        imageUrl: null,
        technologies: ['JavaScript', 'React', 'Flask', 'Python'],
        githubUrl: 'https://github.com/Ryan-DPC/blog-app-flask-reactjs-0.1.0',
        liveUrl: null,
        startDate: new Date('2026-01-09'),
        endDate: null,
        featured: false,
        order: 6,
        createdAt: new Date('2026-01-09'),
        updatedAt: new Date('2026-01-26'),
    },
];
