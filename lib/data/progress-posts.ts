import type { BlogPost } from '@/types';

/**
 * Progress journal posts — photo-first updates about project work.
 * Fallback when the database has no published posts yet.
 * Replace coverImage URLs via admin once screenshots are uploaded.
 */
export const progressPosts: BlogPost[] = [
    {
        id: 'post-vext-desktop',
        slug: 'vext-launcher-desktop',
        title_fr: 'Vext — avancée launcher desktop',
        title_en: 'Vext — desktop launcher progress',
        content_fr:
            'Session de travail sur le launcher Vext (Tauri + Vue).\n\n' +
            'Points avancés :\n' +
            '- Structure du shell desktop\n' +
            '- Première navigation store / bibliothèque\n' +
            '- Préparation des lobbies et de l’auth\n\n' +
            'Les captures d’écran de l’UI seront ajoutées ici au fil des sprints — uploadez-les depuis l’admin (image de couverture + images dans le contenu).',
        content_en:
            'Work session on the Vext launcher (Tauri + Vue).\n\n' +
            'Progress:\n' +
            '- Desktop shell structure\n' +
            '- Early store / library navigation\n' +
            '- Lobby and auth groundwork\n\n' +
            'UI screenshots will be added here across sprints — upload them from the admin (cover image + inline photos).',
        excerpt_fr: 'Captures et notes sur l’avancée du launcher desktop Vext.',
        excerpt_en: 'Screenshots and notes on Vext desktop launcher progress.',
        coverImage: null,
        published: true,
        publishedAt: new Date('2026-08-18'),
        createdAt: new Date('2026-08-18'),
        updatedAt: new Date('2026-08-18'),
    },
    {
        id: 'post-crimsons-wip',
        slug: 'crimsons-visuel-en-cours',
        title_fr: 'Crimsons — tests visuels en cours',
        title_en: 'Crimsons — visual tests in progress',
        content_fr:
            'Itération sur Crimsons côté navigateur.\n\n' +
            'Objectif de ce journal : documenter l’évolution avec des photos / captures (ambiances, UI, gameplay).\n\n' +
            'Prochaine étape : ajouter une galerie d’images d’avancement via l’espace admin.',
        content_en:
            'Iteration on Crimsons in the browser.\n\n' +
            'Goal of this journal: document progress with photos / screenshots (mood, UI, gameplay).\n\n' +
            'Next step: add a progress image gallery from the admin area.',
        excerpt_fr: 'Journal photo de l’évolution visuelle de Crimsons.',
        excerpt_en: 'Photo journal of Crimsons visual progress.',
        coverImage: null,
        published: true,
        publishedAt: new Date('2026-09-14'),
        createdAt: new Date('2026-09-14'),
        updatedAt: new Date('2026-09-14'),
    },
    {
        id: 'post-ether-games',
        slug: 'jeux-tests-ether',
        title_fr: 'Jeux tests Ether — SpludBuster & Stick Fighter',
        title_en: 'Ether test games — SpludBuster & Stick Fighter',
        content_fr:
            'Deux jeux créés pour valider Ether / Vext :\n\n' +
            '- SpludBuster : boucle type Brotato\n' +
            '- Stick Fighter : online + auth launcher ↔ jeu\n\n' +
            'Ce billet servira de fil d’avancement avec captures de sessions de test.',
        content_en:
            'Two games built to validate Ether / Vext:\n\n' +
            '- SpludBuster: Brotato-like loop\n' +
            '- Stick Fighter: online + launcher ↔ game auth\n\n' +
            'This post will track progress with test-session screenshots.',
        excerpt_fr: 'Notes et futures photos des jeux de test liés à Ether.',
        excerpt_en: 'Notes and upcoming photos of Ether-related test games.',
        coverImage: null,
        published: true,
        publishedAt: new Date('2026-01-08'),
        createdAt: new Date('2026-01-08'),
        updatedAt: new Date('2026-01-08'),
    },
];
