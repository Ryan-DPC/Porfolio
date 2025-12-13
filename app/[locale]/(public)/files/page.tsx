'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { File, Folder } from '@/types';
import { formatFileSize, isImageFile } from '@/lib/utils/file-formatting';
import { Button } from '@/components/ui/Button';

export default function FilesPage() {
    const t = useTranslations();
    const [files, setFiles] = useState<File[]>([]);

    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');

    useEffect(() => {
        fetch('/api/files')
            .then((res) => res.json())
            .then((data) => {
                setFiles(data.files || []);

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const imageFiles = files.filter((f) => isImageFile(f.mimeType));
    const otherFiles = files.filter((f) => !isImageFile(f.mimeType));

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-custom">
                    <div className="skeleton h-12 w-64 mx-auto mb-8"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton h-48"></div>
                        ))}
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
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        {t('files.title')}
                    </h1>
                </motion.div>

                {/* View Mode Toggle */}
                <div className="flex justify-center gap-4 mb-8">
                    <Button
                        variant={viewMode === 'gallery' ? 'primary' : 'outline'}
                        onClick={() => setViewMode('gallery')}
                    >
                        {t('files.gallery')}
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'primary' : 'outline'}
                        onClick={() => setViewMode('list')}
                    >
                        {t('files.list')}
                    </Button>
                </div>

                {viewMode === 'gallery' && imageFiles.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Images</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imageFiles.map((file) => (
                                <motion.a
                                    key={file.id}
                                    href={file.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative aspect-square overflow-hidden rounded-lg group"
                                >
                                    <img
                                        src={file.downloadUrl}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Files */}
                {otherFiles.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            {viewMode === 'gallery' ? 'Autres fichiers' : 'Tous les fichiers'}
                        </h2>
                        <div className="space-y-2">
                            {otherFiles.map((file) => (
                                <motion.a
                                    key={file.id}
                                    href={file.downloadUrl}
                                    download
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 rounded-lg border border-dark-border dark:border-light-border hover:bg-dark-surface dark:hover:bg-light-surface transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <svg className="w-8 h-8 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <div className="font-medium">{file.name}</div>
                                            <div className="text-sm text-text-dark-secondary dark:text-text-secondary">
                                                {formatFileSize(file.size)}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        {t('files.download')}
                                    </Button>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {files.length === 0 && (
                    <div className="text-center text-text-dark-secondary dark:text-text-secondary py-12">
                        {t('files.noFiles')}
                    </div>
                )}
            </div>
        </div>
    );
}
