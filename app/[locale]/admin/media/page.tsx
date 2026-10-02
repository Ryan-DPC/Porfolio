'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AdminNav } from '@/components/layout/AdminNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Project } from '@/types';

interface CvInfo {
    url: string | null;
    path: string | null;
    name: string | null;
}

export default function AdminMediaPage() {
    const t = useTranslations('admin.media');
    const tc = useTranslations('common');
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';

    const [projects, setProjects] = useState<Project[]>([]);
    const [cv, setCv] = useState<CvInfo>({ url: null, path: null, name: null });
    const [loading, setLoading] = useState(true);
    const [busyKey, setBusyKey] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const cvInputRef = useRef<HTMLInputElement>(null);
    const projectInputs = useRef<Record<string, HTMLInputElement | null>>({});

    const load = async () => {
        setLoading(true);
        try {
            const [projectsRes, cvRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/media/cv'),
            ]);
            const projectsData = await projectsRes.json();
            const cvData = await cvRes.json();
            setProjects(Array.isArray(projectsData) ? projectsData : []);
            setCv(cvData);
        } catch {
            setError(tc('error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadProjectImage = async (project: Project, file: File) => {
        setBusyKey(project.id);
        setError('');
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', project.id);
        if (project.githubUrl) formData.append('githubUrl', project.githubUrl);

        try {
            const res = await fetch('/api/media/project-image', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || tc('error'));
            setMessage(t('projectImageSaved'));
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : tc('error'));
        } finally {
            setBusyKey(null);
        }
    };

    const removeProjectImage = async (project: Project) => {
        if (!confirm(tc('confirmDelete'))) return;
        setBusyKey(project.id);
        setError('');
        const params = new URLSearchParams();
        if (!project.id.startsWith('gh-')) params.set('projectId', project.id);
        if (project.githubUrl) params.set('githubUrl', project.githubUrl);

        try {
            const res = await fetch(`/api/media/project-image?${params}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error(tc('error'));
            setMessage(t('projectImageRemoved'));
            await load();
        } catch {
            setError(tc('error'));
        } finally {
            setBusyKey(null);
        }
    };

    const uploadCv = async (file: File) => {
        setBusyKey('cv');
        setError('');
        setMessage('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/media/cv', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || tc('error'));
            setMessage(t('cvSaved'));
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : tc('error'));
        } finally {
            setBusyKey(null);
            if (cvInputRef.current) cvInputRef.current.value = '';
        }
    };

    const removeCv = async () => {
        if (!confirm(tc('confirmDelete'))) return;
        setBusyKey('cv');
        try {
            const res = await fetch('/api/media/cv', { method: 'DELETE' });
            if (!res.ok) throw new Error(tc('error'));
            setMessage(t('cvRemoved'));
            await load();
        } catch {
            setError(tc('error'));
        } finally {
            setBusyKey(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <div className="container-custom section-padding">
                <AdminNav />
                <h1 className="text-3xl font-bold gradient-text mb-2">{t('title')}</h1>
                <p className="text-text-dark-secondary dark:text-text-secondary mb-8 max-w-2xl">
                    {t('subtitle')}
                </p>

                {message && (
                    <p className="mb-4 text-sm text-green-500">{message}</p>
                )}
                {error && (
                    <p className="mb-4 text-sm text-red-500">{error}</p>
                )}

                {/* CV */}
                <Card className="mb-10">
                    <h2 className="text-xl font-bold mb-2">{t('cvTitle')}</h2>
                    <p className="text-sm text-text-dark-secondary dark:text-text-secondary mb-4">
                        {t('cvHelp')}
                    </p>

                    {cv.url ? (
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <a
                                href={cv.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-electric-blue hover:underline"
                            >
                                {cv.name || t('cvCurrent')}
                            </a>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => cvInputRef.current?.click()}
                                    disabled={busyKey === 'cv'}
                                >
                                    {t('cvReplace')}
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={removeCv}
                                    disabled={busyKey === 'cv'}
                                >
                                    {tc('delete')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            onClick={() => cvInputRef.current?.click()}
                            disabled={busyKey === 'cv'}
                            className="mb-2"
                        >
                            {busyKey === 'cv' ? tc('loading') : t('cvUpload')}
                        </Button>
                    )}

                    <input
                        ref={cvInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadCv(file);
                        }}
                    />
                </Card>

                {/* Project photos */}
                <h2 className="text-xl font-bold mb-4">{t('projectsTitle')}</h2>
                <p className="text-sm text-text-dark-secondary dark:text-text-secondary mb-6">
                    {t('projectsHelp')}
                </p>

                {loading ? (
                    <div className="skeleton h-40" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => {
                            const title = locale === 'fr' ? project.title_fr : project.title_en;
                            return (
                                <Card key={project.id} className="space-y-4">
                                    <div className="aspect-video rounded-md overflow-hidden bg-dark-border/40 dark:bg-light-border/40">
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-sm text-text-dark-secondary dark:text-text-secondary">
                                                {t('noImage')}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{title}</h3>
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-electric-blue hover:underline"
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <input
                                            ref={(el) => {
                                                projectInputs.current[project.id] = el;
                                            }}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadProjectImage(project, file);
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            disabled={busyKey === project.id}
                                            onClick={() => projectInputs.current[project.id]?.click()}
                                        >
                                            {busyKey === project.id
                                                ? tc('loading')
                                                : project.imageUrl
                                                  ? t('replaceImage')
                                                  : t('uploadImage')}
                                        </Button>
                                        {project.imageUrl && (
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                disabled={busyKey === project.id}
                                                onClick={() => removeProjectImage(project)}
                                            >
                                                {tc('delete')}
                                            </Button>
                                        )}
                                        <a href={`/${locale}/projects`} target="_blank" rel="noreferrer">
                                            <Button size="sm" variant="ghost">
                                                {t('preview')}
                                            </Button>
                                        </a>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
