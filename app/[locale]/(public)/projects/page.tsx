'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { usePathname } from 'next/navigation';

export default function ProjectsPage() {
    const t = useTranslations();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects')
            .then((res) => res.json())
            .then((data) => {
                setProjects(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="skeleton h-12 w-64 mx-auto mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="skeleton h-64"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-padding">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        {t('projects.title')}
                    </h1>
                    <p className="text-lg text-text-dark-secondary dark:text-text-secondary">
                        {projects.length} {projects.length === 1 ? 'projet' : 'projets'}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card hover className="h-full">
                                {project.imageUrl && (
                                    <img
                                        src={project.imageUrl}
                                        alt={locale === 'fr' ? project.title_fr : project.title_en}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-bold mb-2">
                                    {locale === 'fr' ? project.title_fr : project.title_en}
                                </h3>
                                <p className="text-text-dark-secondary dark:text-text-secondary mb-4 line-clamp-3">
                                    {locale === 'fr' ? project.description_fr : project.description_en}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 text-xs rounded-full bg-electric-blue/20 text-electric-blue"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-sm text-text-dark-secondary dark:text-text-secondary">
                                    {formatDate(project.startDate, locale)}
                                    {project.endDate ? ` - ${formatDate(project.endDate, locale)}` : ` - ${t('projects.ongoing')}`}
                                </div>
                                {(project.githubUrl || project.liveUrl) && (
                                    <div className="flex gap-4 mt-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-electric-blue hover:underline text-sm"
                                            >
                                                {t('projects.viewCode')}
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-electric-blue hover:underline text-sm"
                                            >
                                                {t('projects.viewProject')}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center text-text-dark-secondary dark:text-text-secondary">
                        Aucun projet pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
}
